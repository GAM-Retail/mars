import { Moon, Sun } from 'lucide-react';
import { useTheme } from '~/components/ThemeProvider';
import { Button } from '~/components/ui/button';

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggle = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="size-8">
      {resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
