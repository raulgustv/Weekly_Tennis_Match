
export const SANCTION_CATEGORIES = [
    {
        value: 'late_15_30',
        label: 'Late arrival (15-30)',
        policy: '1st: warning - 2nd: 14 days - 3rd: 30 days'
    },
    {
        value: 'late_31_plus',
        label: 'Late arrival (30m min or more)',
        policy: '1st: 21 days - 2nd: 60 days'
    },
    {
        value: 'no_show',
        label: 'No-show',
        policy: '30 days'
    },
    {
        value: 'backup_no_show',
        label: 'Backup assigned did not show',
        policy: '1st: warning - 2nd: 30 days'
    },
    {
        value: 'last_minute_cancel',
        label: 'Last minute cancellation',
        policy: '1st: warning - 2nd: 30 days (counts as no show)'
    },
    {
        value: 'offensive_behavior',
        label: 'Offensive behavior',
        policy: '30 days'
    },
    {
        value: 'other',
        label: 'Other',
        policy: 'At admins discretion'
    },
]

export const SUSPENSION_DAYS_OPTIONS = [14, 21, 30, 60]

export const getSanctionCategory = (value) => SANCTION_CATEGORIES.find(c => c.value === value) || null;


export const getCategoryLabel = (value) =>
    getSanctionCategory(value)?.label || value





