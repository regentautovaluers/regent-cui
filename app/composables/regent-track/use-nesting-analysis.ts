import { toDate } from "date-fns";

export default function useNestingAnalysis() {
  const { get } = useStandardizedApi();
  const customPickCalendarOpen = ref(false);
  const availableTimelines: AvailableTimelines[] = [
    { id: "today", text: "Today" },
    { id: "this_week", text: "This Week" },
    { id: "last_thirty_days", text: "Last Thirty Days" },
    { id: "last_three_months", text: "Last Three Months" },
    { id: "custom", text: "Custom" },
  ];
  const dateRangeForAnalysis = reactive({
    fromDate: "",
    toDate: "",
  });
  const deviceHistory: Ref<DeviceHistory | null> = ref(null);
  const loadingDeviceHistory = ref(false);
  const store = useTrackedVehiclesStore();

  async function loadDeviceHistory(
    fromDate: string,
    toDate: string,
    deviceId: string,
  ) {
    try {
      // trigger loading state to show skeletons
      loadingDeviceHistory.value = true;
      const history = await get<DeviceHistory>(
        "/api/regent-tracking/device-history",
        {
          deviceId,
          fromDate,
          toDate,
        },
      );

      if (history.success) {
        const response = history as StandardSuccessResponse<DeviceHistory>;
        deviceHistory.value = response.data;
      }
    } catch (ex) {
      // TODO: show an error toast here
    } finally {
      loadingDeviceHistory.value = false;
    }
  }

  const nestingAreas: ComputedRef<AnalyzedLocation[]> = computed(() => {
    if (deviceHistory.value) {
      let result = analyzeNestingAreas(deviceHistory.value);
      result = calculateLocationTimeFractions(result);

      return result;
    }

    return [];
  });

  const deviceMovement = computed<DayMovement[]>(() => {
    if (!deviceHistory.value || !Array.isArray(deviceHistory.value.items)) {
      return [];
    }

    return analyzeVehicleTripHistory(deviceHistory.value);
  });

  function deriveDateRange(timeline: FilterTimelines) {
    if (timeline == "custom") {
      customPickCalendarOpen.value = true;
      return;
    }

    customPickCalendarOpen.value = false;
    const range = calculateDateRange(timeline);
    dateRangeForAnalysis.fromDate = range.startDate;
    dateRangeForAnalysis.toDate = range.endDate;
  }

  watch(
    dateRangeForAnalysis,
    async (newRange) => {
      if (newRange.fromDate && newRange.toDate) {
        await loadDeviceHistory(
          newRange.fromDate,
          newRange.toDate,
          store.openVehicleId!.toString(),
        );
      }
    },
    { immediate: true, deep: true },
  );

  return {
    customPickCalendarOpen,
    dateRangeForAnalysis,
    nestingAreas,
    deviceMovement,
    loadingDeviceHistory,
    availableTimelines,
    deriveDateRange,
  };
}
