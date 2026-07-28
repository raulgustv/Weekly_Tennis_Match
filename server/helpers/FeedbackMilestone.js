
export const APP_FEEDBACK_MILESTONES = [2, 5, 10, 20, 50];

const SET_AFTER_LAST = 50;

export const  getNextMilestone = (currentMilestone) => {
    const next = APP_FEEDBACK_MILESTONES.find((m) => m > currentMilestone);

    if(next) return next;

    return currentMilestone + SET_AFTER_LAST;
}