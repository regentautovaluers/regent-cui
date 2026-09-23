import { defineStore } from "pinia";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export const useTrackedVehiclesStore = defineStore("trackedVehiclesStore", {
  state: (): {
    allVehicles: TrackedVehicles[];
    activeView: TrackerStatusWrapperName | null;
    openVehicleId: number | null;
    lastUpdateTime: Date | null;
    searchRegNo: string;
    isLoading: boolean;
    error: string | null;
    sseAbortController: AbortController | null;
    isSseActive: boolean;
  } => {
    return {
      allVehicles: [],
      activeView: null,
      openVehicleId: null,
      lastUpdateTime: new Date(),
      searchRegNo: "",
      isLoading: false,
      error: null,
      sseAbortController: null,
      isSseActive: false,
    };
  },
  getters: {
    activeVehicles: (state): TrackedVehicles[] =>
      state.allVehicles.filter((v) => !isDeviceSubscriptionExpired(v)),

    expiredVehicles: (state): TrackedVehicles[] =>
      state.allVehicles.filter((v) => isDeviceSubscriptionExpired(v)),

    getActiveVehicle(state) {
      if (!state.openVehicleId) return null;
      return state.allVehicles.find((e) => e.id == state.openVehicleId)!;
    },

    getVehicleMetadata(): {
      icon: string;
      name: string;
      data: string | null | undefined;
    }[] {
      const activeVehicle = this.getActiveVehicle;

      return [
        {
          icon: "icon-[material-symbols--person-2-rounded]",
          name: "Driver",
          data: activeVehicle!.driver_data?.name || "-",
        },
        {
          icon: "icon-[material-symbols--android-wifi-4-bar-question-rounded]",
          name: "Status",
          data: activeVehicle!.wrapperStatus as string,
        },
        {
          icon: "icon-[material-symbols--avg-time-outline-rounded]",
          name: "Last Ping",
          data:
            activeVehicle!.time == null || activeVehicle!.time == "Expired"
              ? "-"
              : getTimeAgo(dateStringToDate(activeVehicle!.time)),
        },
      ];
    },

    getSumVehicles(state): TrackedVehicles[] {
      if (state.allVehicles.length == 0) {
        return [];
      }

      // Pre-calculate search term
      const lowerCaseSearch = state.searchRegNo?.toLowerCase() || "";

      return state.allVehicles.filter((v) => {
        let statusMatch = !state.activeView
          ? true
          : state.activeView == v.wrapperStatus;

        const searchMatch =
          !lowerCaseSearch ||
          v.name?.toLowerCase().includes(lowerCaseSearch) ||
          v.driver_data.name?.toLowerCase().includes(lowerCaseSearch);

        // Vehicle must pass BOTH filters
        return statusMatch && searchMatch;
      }) as TrackedVehicles[];
    },

    getViableMapPinVehicles(state): TrackedVehicles[] {
      if (state.allVehicles.length == 0) {
        return [];
      }

      return state.allVehicles.filter(
        (v) => v.wrapperStatus == "Online" || v.wrapperStatus == "Offline",
      ) as TrackedVehicles[];
    },
  },
  actions: {
    async loadTrackedVehicles(forceRefresh = false) {
      // Avoid re-fetching if data is already populated, unless explicitly forced
      if (this.allVehicles.length > 0 && !forceRefresh) return;

      this.isLoading = true;
      this.error = null;

      try {
        const { data, error, refresh } = await useApiData<TrackedVehicles[]>(
          "rt-tracked-vehicles",
          "/api/regent-tracking/load-vehicles",
          {
            method: "GET",
          },
        );

        if (forceRefresh) {
          await refresh();
        }

        const rawList = data.value || [];

        // classify the vehicles here
        rawList.forEach((value, index, arr) => {
          const properTrackerStatus = deriveProperTrackerStatus(
            value.online,
            value.device_data.expiration_date,
          );
          arr[index]!.wrapperStatus = properTrackerStatus;
        });

        this.allVehicles = rawList;

        this.lastUpdateTime = new Date();
      } catch (err: any) {
        this.error = err?.message || "Failed to load tracked vehicles.";
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update dynamic telemetry (lat, lng, timestamp) for a single vehicle in place
     */
    setTickedDeviceLocation(tick: {
      deviceId: string | number;
      newLat: number;
      newLng: number;
      time: string;
    }) {
      const updateList = (list: TrackedVehicles[]) => {
        const target = list.find((v) => v.id === tick.deviceId);
        if (target) {
          target.lat = tick.newLat;
          target.lng = tick.newLng;
          target.time = tick.time;
        }
      };

      updateList(this.activeVehicles);
      updateList(this.expiredVehicles);
    },

    /**
     * Initialize real-time location stream via SSE
     */
    async initializeFrequentUpdateSSE() {
      // Prevent duplicate SSE connections if one is already alive
      if (this.isSseActive) return;

      this.stopSSEUpdates(); // Ensure clean slate
      this.sseAbortController = new AbortController();
      this.isSseActive = true;

      try {
        await fetchEventSource("/api/regent-tracking/load-vehicles-sse", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: this.sseAbortController.signal,
          onopen: async (response) => {
            if (!response.ok) {
              this.isSseActive = false;
            }
          },
          onmessage: (msg) => {
            if (this.sseAbortController?.signal.aborted) return;

            try {
              const result: TrackedVehicleFetchTick = JSON.parse(msg.data);

              result.vehicles.forEach((e) => {
                this.setTickedDeviceLocation({
                  deviceId: e.id,
                  newLat: e.lat,
                  newLng: e.lng,
                  time: e.time,
                });
              });

              // this.lastUpdateTime = result.tick_time;
            } catch (e) {
              console.error("Failed to parse stream segment", e);
            }
          },
          onerror: (err) => {
            console.error("SSE connection error:", err);
            this.isSseActive = false;
            throw err; // Stop automatic retry loop if desired
          },
        });
      } catch (error) {
        this.isSseActive = false;
        // TODO: Implement a toast here
      }
    },

    /**
     * Terminate the active SSE connection and clean up resources
     */
    stopSSEUpdates() {
      if (this.sseAbortController) {
        this.sseAbortController.abort();
        this.sseAbortController = null;
      }
      this.isSseActive = false;
    },
  },
});
