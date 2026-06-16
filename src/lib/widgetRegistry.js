import ClockWidget from '@/components/Widgets/ClockWidget';
import WeatherWidget from '@/components/Widgets/WeatherWidget';
import CalendarWidget from '@/components/Widgets/CalendarWidget';
import AnalogClockWidget from '@/components/Widgets/AnalogClockWidget';
import MusicWidget from '@/components/Widgets/MusicWidget';

export const WIDGET_REGISTRY = {
  clock: {
    id: 'clock',
    component: ClockWidget,
    defaultX: 64,
    defaultY: 200,
  },
  weather: {
    id: 'weather',
    component: WeatherWidget,
    defaultX: 64,
    defaultY: 450,
  },
  calendar: {
    id: 'calendar',
    component: CalendarWidget,
    defaultX: 264,
    defaultY: 250,
  },
  analogClock: {
    id: 'analogClock',
    component: AnalogClockWidget,
    defaultX: 400,
    defaultY: 200,
  },
  musicPlayer: {
    id: 'musicPlayer',
    component: MusicWidget,
    defaultX: 400,
    defaultY: 450,
  }
};
