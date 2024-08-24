import useSettings from "app/hooks/useSettings";
import { SecondarySidenavTheme } from "../MatxTheme/SecondarySidenavTheme";

export default function SecondarySidebar() {
  const { settings } = useSettings();
  const secondarySidebarTheme = settings.themes[settings.secondarySidebar.theme];

  return (
    <SecondarySidenavTheme theme={secondarySidebarTheme}>
      {/* {settings.secondarySidebar.open && <SecondarySidebarContent />} */}
      {/* <SecondarySidebarToggle /> */}
    </SecondarySidenavTheme>
  );
}
