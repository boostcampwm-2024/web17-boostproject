export class NewDate extends Date {
  constructor(date?: Date) {
    if (date) super(date);
    else super();
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNewDate(date: any): date is NewDate {
    return (
      date &&
      typeof date.dateToNewDate === 'function' &&
      typeof date.isSameWeek === 'function' &&
      typeof date.isSameMonth === 'function' &&
      typeof date.isSameYear === 'function'
    );
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

  dateToNewDate(date: Date): NewDate {
    return new NewDate(date);
  }

  isSameWeek(dateToCompare: NewDate | Date): boolean {
    const toNewDate = (date: Date | NewDate): date is NewDate => {
      return (
        date instanceof NewDate ||
        ((date = this.dateToNewDate(date)), NewDate.isNewDate(date))
      );
    };

    if (toNewDate(dateToCompare)) {
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
    }
    return false;
  }

  isSameMonth(dateToCompare: NewDate | Date): boolean {
    return this.getMonth() === dateToCompare.getMonth();
  }

  isSameYear(dateToCompare: NewDate | Date): boolean {
    return this.getFullYear() === dateToCompare.getFullYear();
  }
}
