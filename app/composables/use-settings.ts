const useSettings = () => {
  const config = useRuntimeConfig();
  const supportedThemes = config.public.SETTINGS_SUPPORTED_THEMES.split(",");

  function setTheme(theme: string) {
    const parentElement = document.getElementsByTagName("html")[0]!;

    parentElement.setAttribute("data-theme", theme);
  }

  return {
    supportedThemes,
    setTheme,
  };
};

export default useSettings;
