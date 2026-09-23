export default function useNestingAnalysis() {
  const { get } = useStandardizedApi();
  const customPickCalendarOpen = ref(false);
  const availableTimelines: Ref<AvailableTimelines[]> = ref([
    { id: "today", text: "Today" },
    { id: "this_week", text: "This Week" },
    { id: "last_thirty_days", text: "Last Thirty Days" },
    { id: "last_three_months", text: "Last Three Months" },
    { id: "custom", text: "Custom" },
  ]);
  const dateRangeForAnalysis = reactive({
    fromDate: "",
    toDate: "",
  });
  const deviceHistory: Ref<DeviceHistory | null> = ref(null);
  const loadingDeviceHistory = ref(false);
  const store = useTrackedVehiclesStore();
  const activeSearchTimeline: Ref<FilterTimelines | null> = ref(null);
  const activeTripPin = ref<NestingAreaAnalysisMapPin | null>(null);

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

  const combinedDeviceMovement: ComputedRef<
    { lat: number; lng: number }[] | null
  > = computed(() =>
    deviceMovement.value.length == 0
      ? null
      : deviceMovement.value.flatMap((e) => e.pingHistory),
  );

  function deriveDateRange(timeline: FilterTimelines) {
    // set the activeSelectTimeline variable
    activeSearchTimeline.value = timeline;

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
    [() => ({ ...dateRangeForAnalysis }), () => store.openVehicleId],
    async ([newRange, newVehicleId]) => {
      if (newRange.fromDate && newRange.toDate && newVehicleId != null) {
        await loadDeviceHistory(
          newRange.fromDate,
          newRange.toDate,
          newVehicleId.toString(),
        );
      }
    },
    { immediate: true },
  );

  return {
    customPickCalendarOpen,
    dateRangeForAnalysis,
    nestingAreas,
    deviceMovement,
    loadingDeviceHistory,
    availableTimelines,
    combinedDeviceMovement,
    activeSearchTimeline,
    activeTripPin,
    deriveDateRange,
  };
}
