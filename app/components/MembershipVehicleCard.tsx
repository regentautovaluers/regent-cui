export default defineComponent({
  props: {
    registration: {
      required: true,
      type: String,
    },
    membershipName: {
      required: true,
      type: String,
    },
    startDate: {
      required: true,
      type: String,
    },
    endDate: {
      required: true,
      type: String,
    },
  },
  setup(props, {}) {
    const displayExpiryStatusChip = (date: string) => {
      const dateProper = extractDate(date);

      if (isDateInPast(dateProper)) {
        return (
          <div class="inline-flex items-center space-x-1">
            <div class="rounded-full size-3 bg-error"></div>
            <span class="uppercase text-sm">inactive</span>
          </div>
        );
      }

      return (
        <div class="inline-flex items-center space-x-1">
          <div class="rounded-full size-3 bg-success"></div>
          <span class="uppercase text-sm">active</span>
        </div>
      );
    };

    return () => (
      <div class="h-fit rounded-lg overflow-clip shadow bg-pink-700 text-slate-200">
        <div class="py-2 px-4 h-36">
          <div class="h-fit flex items-center justify-between">
            <h3 class="text-center font-bold">{props.registration}</h3>
            {/* <button class="btn btn-soft btn-sm btn-accent disabled">
              <span class="icon-[material-symbols--arrow-cool-down-rounded]"></span>
              Save
            </button> */}
          </div>

          <div class="grid grid-cols-2 mt-4">
            <h4 class="col-span-2 font-bold mb-2 text-sm">
              {props.membershipName}
            </h4>
            <div>
              <h2 class="text-sm">Joined</h2>
              <span class="text-sm font-semibold">
                {extractDate(props.startDate)}
              </span>
            </div>
            <div>
              <h2 class="text-sm">Expires</h2>
              <span class="text-sm font-semibold">
                {extractDate(props.endDate)}
              </span>
            </div>
          </div>
        </div>
        <div class="inline-flex justify-between h-12 w-full  bg-base-300/50 items-center py-2 px-4">
          {displayExpiryStatusChip(props.endDate)}

          <a
            href="tel:254735-567-767"
            target="_blank"
            class="inline-flex items-center space-x-1 text-sm"
          >
            <span class="icon-[material-symbols--call]"></span>
            <span class="font-semibold">0735-567-767</span>
          </a>
        </div>
      </div>
    );
  },
});
