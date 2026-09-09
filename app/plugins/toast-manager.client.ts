export default defineNuxtPlugin((_nuxtApp) => {
  const toast = useToast();

  return {
    provide: {
      showToast: (input: ToastNotificationConfig) =>
        toast.add({
          color: input.color ?? "info",
          title: input.title,
          description: input.description,
          close: true,
          ui: {
            root: "bg-linear-to-bl to-primary/10 from-base-100/10 border-none",
            title: "text-lg text-primary font-semibold",
            description: "text-sm text-base-content",
          },
        }),
    },
  };
});
