interface IDate {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
  milliseconds: string;
}

class DateManager {
  static getData(): IDate {
    const date = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat('fr', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Paris',
    });

    const [
      { value: day }, ,
      { value: month }, ,
      { value: year }, ,
      { value: hour }, ,
      { value: minute }, ,
      { value: second }, ,
    ] = dateTimeFormat.formatToParts(date);

    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return {
      day,
      month,
      year,
      hour,
      minute,
      second,
      milliseconds,
    };
  }

  /**
   * Retrieves the month from the current date.
   * @returns The month as a string.
   */
  static getMonth(): string {
    const date = this.getData();
    return date.month;
  }

  /**
   * Gets the current year.
   * @returns The current year as a string.
   */
  static getYear(): string {
    const date = this.getData();
    return date.year;
  }

  /**
   * Returns the day of the current date.
   * @returns {string} The day of the current date.
   */
  static getDay(): string {
    const date = this.getData();
    return date.day;
  }

  /**
   * Returns the current date in the format "day-month-year".
   * @returns The current date as a string.
   */
  static getFullDate(): string {
    const date = this.getData();
    return `${date.day}-${date.month}-${date.year}`;
  }

  /**
   * Returns the current time in the format "hour:minute:second:milliseconds".
   * @returns The current time as a string.
   */
  static getFullHour(): string {
    const date = this.getData();

    return `${date.hour}:${date.minute}:${date.second}:${date.milliseconds}`;
  }
}

export default DateManager;
