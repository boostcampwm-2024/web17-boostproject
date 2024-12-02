export class NewDate extends Date {
  constructor(date: Date) {
    super(date);
  }

  private resetTime(): NewDate {
    this.setHours(0, 0, 0, 0);
    return this;
  }

  private getWeek(): number {
    const date = this.resetTime();
    const firstOne = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(
      ((date.getTime() - firstOne.getTime()) / 86400000 +
        firstOne.getDay() +
        1) /
        7,
    );
  }

  private isLastWeekOfTheYear(): boolean {
    return this.getWeek() === 53;
  }

  private isFirstWeekOfTheYear(): boolean {
    return this.getWeek() === 1;
  }

  isSameWeek(dateToCompare: NewDate): boolean {
    let sameWeek =
      this.getWeek() === dateToCompare.getWeek() &&
      this.getFullYear() === dateToCompare.getFullYear();

    if (
      !sameWeek &&
      this.isLastWeekOfTheYear() &&
      dateToCompare.isFirstWeekOfTheYear()
    ) {
      sameWeek = this.getDay() < dateToCompare.getDay();
    }

    return sameWeek;
  }
}
