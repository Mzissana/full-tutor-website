const METRIKA_COUNTER_ID = 110858833;

export type MetrikaGoal =
  | 'telegram_click'
  | 'vk_click'
  | 'form_start'
  | 'form_submit_success'
  | 'diagnostic_booked'
  | 'diagnostic_attended'
  | 'qualified_lead'
  | 'paid_student';

type GoalParameters = Record<string, string | number | boolean>;

declare global {
  interface Window {
    ym?: (
      counterId: number,
      method: 'reachGoal',
      goal: MetrikaGoal,
      parameters?: GoalParameters,
    ) => void;
  }
}

export function trackMetrikaGoal(goal: MetrikaGoal, parameters: GoalParameters = {}): void {
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return;

  window.ym(METRIKA_COUNTER_ID, 'reachGoal', goal, {
    page_path: window.location.pathname,
    ...parameters,
  });
}
