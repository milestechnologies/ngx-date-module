import * as momentImported from 'moment';

import { IDateModuleConfiguration } from '../config/relativity-date-config.library';
import {
    isHoliday,
    howLongUntilNextHoliday,
    getNextOccurenceOfDate
} from '../holiday/holiday.library';
import { momentDatePart, DateParts } from './date-parts.library';
import { defaultConfig } from '../config/default.config';

const moment = momentImported;

export interface IRelativityDate {
    date: Date;
    add(amount: number, part: DateParts): RelativityDate;
    subtract(amount: number, part: DateParts): RelativityDate;
    format(tokenString?: string): string;
    from(date?: Date): string;
    to(date?: Date): string;
    toMoment(): momentImported.Moment;
}

export class RelativityDate implements IRelativityDate {
    date: Date;
    config: IDateModuleConfiguration;

    /**
     * Create a RelativityDate object
     * @param dateParam Optional. The date object to use for the initial value. Defaults to now.
     * @param asReference Boolean flag indicating whether the dateParam should be handled
     * as a reference to the original. Defaults to false.
     * @param customConfig Optional. Contains an IDateModuleConfiguration object. If not
     * provided, the default config is used.
     */
    constructor(
        dateParam?: Date,
        asReference = false,
        customConfig?: IDateModuleConfiguration
    ) {
        let dateValue: Date;
        if (!dateParam) {
            dateValue = new Date();
        }
        if (!asReference) {
            dateValue = new Date(dateParam);
        } else {
            dateValue = dateParam;
        }
        this.date = dateValue;
        if (customConfig) {
            this.config = customConfig;
        } else {
            this.config = defaultConfig;
        }
    }

    /**
     *  @returns the configuration object of this RelativityDate
     */
    getConfig(): any {
        return this.config;
    }

    /**
     * Add to the RelativityDate value using a specified datePart.
     * @param amount integer amount to add.
     * @param part date part enumerator specifying which part of the date to add to.
     * @returns {RelativityDate} the modified RelativityDate object so that operators can be chained.
     */
    add(amount: number, part: DateParts): RelativityDate {
        const date = moment(this.date)
            .add(amount, this.getMomentDatePart(part))
            .toDate();
        this.setThisDate(date);
        return this;
    }

    /**
     * Subtract from the relativityDate value using a specified datePart.
     * @param amount integer amount to subtract.
     * @param part date part enumerator specifying which part of the date to subtract from.
     * @returns {RelativityDate} the modified RelativityDate object so that operators can be chained.
     */
    subtract(amount: number, part: DateParts): RelativityDate {
        const date = moment(this.date)
            .subtract(amount, this.getMomentDatePart(part))
            .toDate();
        this.setThisDate(date);
        return this;
    }

    private setThisDate(date: Date): void {
        this.date.setFullYear(date.getFullYear());
        this.date.setMonth(date.getMonth());
        this.date.setDate(date.getDate());
        this.date.setHours(date.getHours());
        this.date.setMinutes(date.getMinutes());
        this.date.setSeconds(date.getSeconds());
        this.date.setMilliseconds(date.getMilliseconds());
    }

    private getMomentDatePart(part: DateParts): momentDatePart {
        switch (part) {
            case DateParts.years:
                return 'y';
            case DateParts.quarters:
                return 'Q';
            case DateParts.months:
                return 'M';
            case DateParts.weeks:
                return 'w';
            case DateParts.days:
                return 'd';
            case DateParts.hours:
                return 'h';
            case DateParts.minutes:
                return 'm';
            case DateParts.seconds:
                return 's';
            case DateParts.milliseconds:
                return 'ms';
            default:
                return 'd';
        }
    }

    /**
     * Get a string reprensentation of the RelativityDate using MomentJS.
     * @param tokenString string of tokens representing the date parts in the format you want.
     * Defaults to 'YYYY-MM-DDTHH:mm:ssZ'.
     * Additional documentation can be found here: https://momentjs.com/docs/#/displaying/format/
     * @returns formatted string representation of the RelativityDate.
     */
    format(tokenString?: string): string {
        if (!tokenString) {
            return moment(this.date).format(this.config.defaultFormatString);
        }
        return moment(this.date).format(tokenString);
    }

    /**
     * Get a string representing the amount of time between date param and the relativityDate
     * using MomentJS.
     * Additional documentation can be found here: https://momentjs.com/docs/#/displaying/from/
     * @param date the date to start from when comparing the relativityDate. Defaults to now.
     * @returns string representation of the date
     */
    from(date?: Date): string {
        if (!date) {
            date = new Date();
        }
        return moment(this.date).from(moment(date));
    }

    /**
     * Get a string representing the amount of time between the relativityDate and the date param
     * using MomentJS.
     * Additional documentation can be found here: https://momentjs.com/docs/#/displaying/to/
     * @param date the date to end at when comparing the relativityDate. Defaults to now.
     * @returns a string representation of the date
     */
    to(date?: Date): string {
        if (!date) {
            date = new Date();
        }
        return moment(this.date).to(moment(date));
    }

    /**
     * Provide the RelativityDate as a Moment object.
     * There will NOT be a reference back to the RelativityDate object.
     * Moment documentation here http://momentjs.com/docs/
     */
    toMoment(): momentImported.Moment {
        return moment(this.date);
    }

    /**
     * Checks if this RelativityDate comes before the date provided using MomentJS.
     * Moment documentation here https://momentjs.com/docs/#/displaying/difference/
     * @param date the date to compare with
     * @returns true if the date was before
     */
    isBeforeDate(date: Date): boolean {
        return this.toMoment().diff(date.relativityDate.toMoment()) < 0;
    }
    /**
     * Checks if this RelativityDate comes after the provided date using MomentJS.
     * Moment documentation here https://momentjs.com/docs/#/displaying/difference/
     * @param date the date to compare with
     * @returns true if the date was after
     */
    isAfterDate(date: Date): boolean {
        return this.toMoment().diff(date.relativityDate.toMoment()) > 0;
    }

    /**
     * Referencing function in holiday library
     * @returns Description of Holiday if date matches a holiday or false if date does not match holiday
     */
    isHoliday(): string | boolean {
        return isHoliday.bind(this)();
    }

    /**
     * Referencing function in holiday library
     * @returns returns the string from calling .to(next occurence of holiday)
     */
    howLongUntilNextHoliday(): string {
        return howLongUntilNextHoliday.bind(this)();
    }

    /**
     * Referencing function in holiday library
     * @param month month value passed in
     * @param day day value passed in
     * @returns next instance of the day/month combo
     */
    getNextOccurenceOfDate(month: number, day: number): Date {
        return getNextOccurenceOfDate.bind(this)(month, day);
    }
}
