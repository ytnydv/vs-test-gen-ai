export const frameworkOptions = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
];

export function isValidFramework(selectedFramework: any) {
    return frameworkOptions.some(option => option.value === selectedFramework);
}