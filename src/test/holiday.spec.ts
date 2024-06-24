import { RelativityDate } from "../relativity-date/relativity-date.library";
import { async, TestBed } from '@angular/core/testing';
import { NgxRelativityDateModule } from '../public_api';

describe('holiday', () => {
    describe('isHoliday', () => {
        it('shows whether a date is a default holiday', () => {
            const date = new RelativityDate(new Date(2019, 11, 25));
            expect(date.isHoliday()).toBe('Christmas Day');
        });
        
        it ('shows whether a date is not a default holiday', () => {
            const date = new RelativityDate(new Date(2019, 1, 13));
            expect(date.isHoliday()).toBe(false);
        });

        it('handles observance rules when holiday is on a Saturday', () => {
            const date = new RelativityDate(new Date(2021, 11, 24));
            expect(date.isHoliday()).toBe('Christmas Day');
        });

        it('handles observance rules when holiday is on a Sunday', () => {
            const date = new RelativityDate(new Date(2022, 11, 26));
            expect(date.isHoliday()).toBe('Christmas Day');
        });
    });
});