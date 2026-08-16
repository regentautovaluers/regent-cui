import { useRouter } from "vue-router";

import "flyonui/dist/accordion";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  router.afterEach(async () => {
    setTimeout(() => window.HSAccordion.autoInit());
  });
});
