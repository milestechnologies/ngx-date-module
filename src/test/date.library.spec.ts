import {} from 'jasmine';
import { RelativityDate } from '../relativity-date/relativity-date.library';
import { isMoment, relativeTimeRounding } from 'moment';
import { DateParts } from '../relativity-date/date-parts.library';
import { IDateModuleConfiguration } from '../config/relativity-date-config.library';
import { HolidayDefinitions } from '../holiday/default-holidays.library';
import { async, TestBed } from '@angular/core/testing';
import { NgxRelativityDateModule } from '../public_api';

function getFebruraryFirst2018StartingDate(): Date {
    return new Date(2018, 1, 1);
}

function getOctoberTwentyFifth2018StartingDate(): Date {
    return new Date(2018, 9, 25);
}

describe('date.libary', () => {
    const februaryFirst2018 = getFebruraryFirst2018StartingDate();
    const twoYearsMore = new Date(2020, 1, 1);
    const fourMonthsMore = new Date(2018, 5, 1);
    const twentyDaysMore = new Date(2018, 1, 21);
    const sevenHoursMore = new Date(2018, 1, 1, 7);
    const thirtyMinutesMore = new Date(2018, 1, 1, 0, 30);
    const tenSecondsMore = new Date(2018, 1, 1, 0, 0, 10);
    const nineMillisecondsMore = new Date(2018, 1, 1, 0, 0, 0, 9);
    const fourQuartersMore = new Date(2019, 1, 1);
    const twoWeeksMore = new Date(2018, 1, 15);
    const yaDefault = new Date(2018, 1, 1);
    const octoberTwentyFith2018 = getOctoberTwentyFifth2018StartingDate();
    const twoYearsLess = new Date(2016, 9, 25);
    const fourMonthsLess = new Date(2018, 5, 25);
    const twentyDaysLess = new Date(2018, 9, 5);
    const sevenHoursLess = new Date(2018, 9, 24, 17);
    const thirtyMinutesLess = new Date(2018, 9, 24, 23, 30);
    const tenSecondsLess = new Date(2018, 9, 24, 23, 59, 50);
    const nineMillisecondsLess = new Date(2018, 9, 24, 23, 59, 59, 991);
    let relativityDate: RelativityDate;
    // =================================

    describe('constructor', () => {
        it('takes a custom configuration file', () => {
            const theDate = new Date(2020, 2, 12);
            const config: IDateModuleConfiguration = {
                defaultFormatString: 'dddd, MMMM, Do, YYYY, h:mm:ss a',
                holidays: [
                    HolidayDefinitions.christmas,
                ]
            };

            relativityDate = new RelativityDate(theDate, false, config);

            expect(relativityDate.config).toBe(config);
        });
    });

    describe('get config', () => {
        it('returns the current config', () => {
            const theDate = new Date(2020, 2, 12);
            const config: IDateModuleConfiguration = {
                defaultFormatString: 'dddd, MMMM, Do, YYYY, h:mm:ss a',
                holidays: [
                    HolidayDefinitions.christmas,
                ]
            };

            relativityDate = new RelativityDate(theDate, false, config);
            
            expect(relativityDate.getConfig()).toBe(config);
        });
    });

    describe('add time', () => {
        describe('without asReference', () => {
            const startingDate = getFebruraryFirst2018StartingDate();

            beforeEach(() => {
                relativityDate = new RelativityDate(startingDate);
            });

            it('should add years but not change startingDate', () => {
                const value = relativityDate.add(2, DateParts.years).date;
                expect(value.getTime()).toBe(twoYearsMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add quarters but not change startingDate', () => {
                const value = relativityDate.add(4, DateParts.quarters).date;
                expect(value.getTime()).toBe(fourQuartersMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add months but not change startingDate', () => {
                const value = relativityDate.add(4, DateParts.months).date;
                expect(value.getTime()).toBe(fourMonthsMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add weeks but not change startingDate', () => {
                const value = relativityDate.add(2, DateParts.weeks).date;
                expect(value.getTime()).toBe(twoWeeksMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add days but not change startingDate', () => {
                const value = relativityDate.add(20, DateParts.days).date;
                expect(value.getTime()).toBe(twentyDaysMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add hours but not change startingDate', () => {
                const value = relativityDate.add(7, DateParts.hours).date;
                expect(value.getTime()).toBe(sevenHoursMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add minutes but not change startingDate', () => {
                const value = relativityDate.add(30, DateParts.minutes).date;
                expect(value.getTime()).toBe(thirtyMinutesMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add seconds but not change startingDate', () => {
                const value = relativityDate.add(10, DateParts.seconds).date;
                expect(value.getTime()).toBe(tenSecondsMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add milliseconds but not change startingDate', () => {
                const value = relativityDate.add(9, DateParts.milliseconds)
                    .date;
                expect(value.getTime()).toBe(nineMillisecondsMore.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });

            it('should add default but not change startingDate', () => {
                const value = relativityDate.add(0, null).date;
                expect(value.getTime()).toBe(yaDefault.getTime());
                expect(startingDate.getTime()).toBe(
                    februaryFirst2018.getTime()
                );
            });
        });

        describe('with asReference', () => {
            let startingDate: Date;

            beforeEach(() => {
                startingDate = getFebruraryFirst2018StartingDate();
                relativityDate = new RelativityDate(startingDate, true);
            });

            it('should add years and change startingDate', () => {
                const value = relativityDate.add(2, DateParts.years).date;
                expect(value.getTime()).toBe(twoYearsMore.getTime());
                expect(startingDate.getTime()).toBe(twoYearsMore.getTime());
            });

            it('should add months and change startingDate', () => {
                const value = relativityDate.add(4, DateParts.months).date;
                expect(value.getTime()).toBe(fourMonthsMore.getTime());
                expect(startingDate.getTime()).toBe(fourMonthsMore.getTime());
            });

            it('should add days and change startingDate', () => {
                const value = relativityDate.add(20, DateParts.days).date;
                expect(value.getTime()).toBe(twentyDaysMore.getTime());
                expect(startingDate.getTime()).toBe(twentyDaysMore.getTime());
            });

            it('should add hours and change startingDate', () => {
                const value = relativityDate.add(7, DateParts.hours).date;
                expect(value.getTime()).toBe(sevenHoursMore.getTime());
                expect(startingDate.getTime()).toBe(sevenHoursMore.getTime());
            });

            it('should add minutes and change startingDate', () => {
                const value = relativityDate.add(30, DateParts.minutes).date;
                expect(value.getTime()).toBe(thirtyMinutesMore.getTime());
                expect(startingDate.getTime()).toBe(
                    thirtyMinutesMore.getTime()
                );
            });

            it('should add seconds and change startingDate', () => {
                const value = relativityDate.add(10, DateParts.seconds).date;
                expect(value.getTime()).toBe(tenSecondsMore.getTime());
                expect(startingDate.getTime()).toBe(tenSecondsMore.getTime());
            });

            it('should add milliseconds and change startingDate', () => {
                const value = relativityDate.add(9, DateParts.milliseconds)
                    .date;
                expect(value.getTime()).toBe(nineMillisecondsMore.getTime());
                expect(startingDate.getTime()).toBe(
                    nineMillisecondsMore.getTime()
                );
            });
        });
    });

    describe('subtract time', () => {
        describe('without asReference', () => {
            const startingDate = getOctoberTwentyFifth2018StartingDate();

            beforeEach(() => {
                relativityDate = new RelativityDate(startingDate);
            });

            it('should add years but not change startingDate', () => {
                const value = relativityDate.subtract(2, DateParts.years).date;
                expect(value.getTime()).toBe(twoYearsLess.getTime());
                expect(startingDate.getTime()).toBe(
                    octoberTwentyFith2018.getTime()
                );
            });

            it('should add months but not change startingDate', () => {
                const value = relativityDate.subtract(4, DateParts.months).date;
                expect(value.getTime()).toBe(fourMonthsLess.getTime());
                expect(startingDate.getTime()).toBe(
                    octoberTwentyFith2018.getTime()
                );
            });

            it('should add days but not change startingDate', () => {
                const value = relativityDate.subtract(20, DateParts.days).date;
                expect(value.getTime()).toBe(twentyDaysLess.getTime());
                expect(startingDate.getTime()).toBe(
                    octoberTwentyFith2018.getTime()
                );
            });

            it('should add hours but not change startingDate', () => {
                const value = relativityDate.subtract(7, DateParts.hours).date;
                expect(value.getTime()).toBe(sevenHoursLess.getTime());
                expect(startingDate.getTime()).toBe(
                    octoberTwentyFith2018.getTime()
                );
            });

            it('should add minutes but not change startingDate', () => {
                const value = relativityDate.subtract(30, DateParts.minutes)
                    .date;
                expect(value.getTime()).toBe(thirtyMinutesLess.getTime());
                expect(startingDate.getTime()).toBe(
                    octoberTwentyFith2018.getTime()
                );
            });

            it('should add seconds but not change startingDate', () => {
                const value = relativityDate.subtract(10, DateParts.seconds)
                    .date;
                expect(value.getTime()).toBe(tenSecondsLess.getTime());
                expect(startingDate.getTime()).toBe(
                    octoberTwentyFith2018.getTime()
                );
            });

            it('should add milliseconds but not change startingDate', () => {
                const value = relativityDate.subtract(9, DateParts.milliseconds)
                    .date;
                expect(value.getTime()).toBe(nineMillisecondsLess.getTime());
                expect(startingDate.getTime()).toBe(
                    octoberTwentyFith2018.getTime()
                );
            });
        });

        describe('with asReference', () => {
            let startingDate: Date;

            beforeEach(() => {
                startingDate = getOctoberTwentyFifth2018StartingDate();
                relativityDate = new RelativityDate(startingDate, true);
            });

            it('should add years and change startingDate', () => {
                const value = relativityDate.subtract(2, DateParts.years).date;
                expect(value.getTime()).toBe(twoYearsLess.getTime());
                expect(startingDate.getTime()).toBe(twoYearsLess.getTime());
            });

            it('should add months and change startingDate', () => {
                const value = relativityDate.subtract(4, DateParts.months).date;
                expect(value.getTime()).toBe(fourMonthsLess.getTime());
                expect(startingDate.getTime()).toBe(fourMonthsLess.getTime());
            });

            it('should add days and change startingDate', () => {
                const value = relativityDate.subtract(20, DateParts.days).date;
                expect(value.getTime()).toBe(twentyDaysLess.getTime());
                expect(startingDate.getTime()).toBe(twentyDaysLess.getTime());
            });

            it('should add hours and change startingDate', () => {
                const value = relativityDate.subtract(7, DateParts.hours).date;
                expect(value.getTime()).toBe(sevenHoursLess.getTime());
                expect(startingDate.getTime()).toBe(sevenHoursLess.getTime());
            });

            it('should add minutes and change startingDate', () => {
                const value = relativityDate.subtract(30, DateParts.minutes)
                    .date;
                expect(value.getTime()).toBe(thirtyMinutesLess.getTime());
                expect(startingDate.getTime()).toBe(
                    thirtyMinutesLess.getTime()
                );
            });

            it('should add seconds and change startingDate', () => {
                const value = relativityDate.subtract(10, DateParts.seconds)
                    .date;
                expect(value.getTime()).toBe(tenSecondsLess.getTime());
                expect(startingDate.getTime()).toBe(tenSecondsLess.getTime());
            });

            it('should add milliseconds and change startingDate', () => {
                const value = relativityDate.subtract(9, DateParts.milliseconds)
                    .date;
                expect(value.getTime()).toBe(nineMillisecondsLess.getTime());
                expect(startingDate.getTime()).toBe(
                    nineMillisecondsLess.getTime()
                );
            });
        });
    });

    describe('format', () => {
        const startingDate = getOctoberTwentyFifth2018StartingDate();

        beforeEach(() => {
            relativityDate = new RelativityDate(startingDate);
        });

        it('should return default format when no param passed', () => {
            // default format is set in config to dddd, MMMM Do YYYY, h:mm:ss a
            const value = relativityDate.format();
            expect(value).toContain('Thursday, October 25th 2018');
        });

        it('should return custom format when param passed', () => {
            const value = relativityDate.format('ddd, hA');
            expect(value).toBe('Thu, 12AM');
        });
    });

    describe('from', () => {
        const nowDate = new Date();
        const twoMonthsEarlier = new Date();
        twoMonthsEarlier.setMonth(twoMonthsEarlier.getMonth() - 2);
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        beforeEach(() => {
            relativityDate = new RelativityDate(twoMonthsEarlier);
        });

        it('should return from now when no param passed', () => {
            const value = relativityDate.from();
            expect(value).toBe('2 months ago');
        });

        it('should return from date when param passed', () => {
            const value = relativityDate.from(threeMonthsLater);
            expect(value).toBe('5 months ago');
        });
    });

    describe('to', () => {
        const nowDate = new Date();
        const twoMonthsEarlier = new Date();
        twoMonthsEarlier.setMonth(twoMonthsEarlier.getMonth() - 2);
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        beforeEach(() => {
            relativityDate = new RelativityDate(twoMonthsEarlier);
        });

        it('should return to now when no param passed', () => {
            const value = relativityDate.to();
            expect(value).toBe('in 2 months');
        });

        it('should return to date when param passed', () => {
            const value = relativityDate.to(threeMonthsLater);
            expect(value).toBe('in 5 months');
        });
    });

    describe('toMoment', () => {
        const startingDate = getOctoberTwentyFifth2018StartingDate();

        beforeEach(() => {
            relativityDate = new RelativityDate(startingDate);
        });

        it('should be a Moment object', () => {
            const value = relativityDate.toMoment();
            expect(isMoment(value)).toBe(true);
        });
    });

    describe('without dateValue', () => {
        beforeEach(() => {
            relativityDate = new RelativityDate(null, false);
        });

        it('should get new date', () => {
            expect(relativityDate.date).not.toBeNull();
        });
    });

    describe('date comparison', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [],
                imports: [NgxRelativityDateModule.forRoot()]
            });
        }));

        it(('correctly detects if this date is before another one'), () => {
            const theDate = new RelativityDate(new Date(2019, 1, 22));
            const dateBefore = new Date(2019, 2, 12);
        
            expect(theDate.isBeforeDate(dateBefore)).toBe(true);
        });

        it(('correctly detects if this date is after another one'), () => {
            const theDate = new Date(2019, 2, 12);
            const dateAfter = new RelativityDate(new Date(2019, 5, 18));

            expect(dateAfter.isAfterDate(theDate));
        });
    });
});
