const useSettings = () => {
  const config = useRuntimeConfig();
  const supportedThemes = config.public.SETTINGS_SUPPORTED_THEMES.split(",");
  const sidebarOpen = useState("sidebarOpen", () => false);

  function setTheme(theme: string) {
    const parentElement = document.getElementsByTagName("html")[0]!;

    parentElement.setAttribute("data-theme", theme);
  }

  function toggleSidebar() {
    const current = unref(sidebarOpen.value);
    sidebarOpen.value = !current;
  }

  return {
    supportedThemes,
    setTheme,
    sidebarOpen,
    toggleSidebar,
  };
};

export default useSettings;
