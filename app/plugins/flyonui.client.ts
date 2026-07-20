import "flyonui/flyonui";


export default defineNuxtPlugin(() => {
  const router = useRouter();
  router.afterEach(async () => {
    setTimeout(() => window.HSStaticMethods.autoInit());
  });
});
