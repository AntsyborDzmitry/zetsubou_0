/**
 * Test suit for location service
 */

import PaginationService from './pagination-service';
import 'angularMocks';

describe('PaginationService', () => {
    let sut;
    let $q;

    beforeEach(inject(() => {
        sut = new PaginationService($q);
    }));

    describe('`paginate` method', () => {
        it('should exist', () => {
            expect(sut.paginate).toBeDefined();
        });

        it('should initialize result when `fourth` argument is null', () => {
            const result = sut.paginate([], 0, 10, null);

            expect(result).toBeDefined();
        });

        it('should initialize result when `fourth` argument is undefined', () => {
            const result = sut.paginate([], 0, 10, null);

            expect(result).toBeDefined();
        });

        it('should initialize result when `result` argument is not provided', () => {
            const result = sut.paginate([], 0, 10);

            expect(result).toBeDefined();
        });

        describe('should return proper result when', () => {
            let checkNegative = function(result, pageSize) {
                expect(result).toBeDefined();

                expect(result.rowMax).toEqual(0);
                expect(result.rowMin).toEqual(0);

                expect(result.pageSize).toEqual(pageSize);
                expect(result.pageIndex).toEqual(0);
                expect(result.pageCount).toEqual(0);

                expect(result.data).toBeDefined();
                expect(result.window).toBeDefined();

                expect(result.data.length).toEqual(0);
                expect(result.window.length).toEqual(1);
                expect(result.window[0].index).toEqual(0);
                expect(result.window[0].display).toEqual(1);
            };

            it('`data` is undefined', () => {
                const result = sut.paginate(undefined, 0, 10);

                checkNegative(result, 10);
            });

            it('`pageIndex` is undefined', () => {
                const result = sut.paginate([], undefined, 10);

                checkNegative(result, 10);
            });

            it('`pageCount` is undefined', () => {
                const result = sut.paginate([], 0, undefined);

                checkNegative(result, 0);
            });

            it('`data` is null', () => {
                const result = sut.paginate([], null, 10);

                checkNegative(result, 10);
            });

            it('`pageIndex` is null', () => {
                const result = sut.paginate([], null, 10);

                checkNegative(result, 10);
            });

            it('`pageSize` is null', () => {
                const result = sut.paginate([], 0, null);

                checkNegative(result, 0);
            });

            it('there is no data', () => {
                const result = sut.paginate([], 0, 10);

                expect(result.pageSize).toEqual(10);
                expect(result.pageIndex).toEqual(0);
                expect(result.pageCount).toEqual(0);

                expect(result.window.length).toEqual(1);
                expect(result.window[0].index).toEqual(0);
                expect(result.window[0].display).toEqual(1);
            });

            it('all arguments are properly defined', () => {
                const pageSize = 10;
                const pageIndex = 0;

                const result = sut.paginate(Array.from(Array(12).keys()), pageIndex, pageSize);

                expect(result.rowMin).toEqual(1);
                expect(result.rowMax).toEqual(10);

                expect(result.pageSize).toEqual(10);
                expect(result.pageIndex).toEqual(0);
                expect(result.pageCount).toEqual(2);

                expect(result.data.length).toBe(10);
                expect(result.data[0]).toBe(0);
                expect(result.data[1]).toBe(1);
                expect(result.data[2]).toBe(2);
                expect(result.data[3]).toBe(3);
                expect(result.data[4]).toBe(4);
                expect(result.data[5]).toBe(5);
                expect(result.data[6]).toBe(6);
                expect(result.data[7]).toBe(7);
                expect(result.data[8]).toBe(8);
                expect(result.data[9]).toBe(9);

                expect(result.window.length).toEqual(2);
                expect(result.window[0].index).toEqual(0);
                expect(result.window[0].display).toEqual(1);

                expect(result.window[1].display).toEqual(2);
            });

            it('last page contains less records than the page size', () => {
                const pageSize = 10;
                const pageIndex = 1;
                const result = sut.paginate(Array.from(Array(12).keys()), pageIndex, pageSize);

                expect(result.rowMin).toEqual(11);
                expect(result.rowMax).toEqual(12);

                expect(result.pageSize).toEqual(pageSize);
                expect(result.pageIndex).toEqual(pageIndex);
                expect(result.pageCount).toEqual(2);

                expect(result.data.length).toBe(2);
                expect(result.data[0]).toBe(10);
                expect(result.data[1]).toBe(11);

                expect(result.window.length).toEqual(2);

                expect(result.window[0].index).toEqual(0);
                expect(result.window[0].display).toEqual(1);

                expect(result.window[1].index).toEqual(1);
                expect(result.window[1].display).toEqual(2);
            });

            it('last page contains less records than the page size (middle case)', () => {
                const pageSize = 10;
                const pageIndex = 5;

                const data = [];
                for (let i = 0; i < 100; i++) {
                    data.push(i);
                }

                const result = sut.paginate(data, pageIndex, pageSize);

                expect(result.rowMin).toEqual(51);
                expect(result.rowMax).toEqual(60);

                expect(result.pageSize).toEqual(pageSize);
                expect(result.pageIndex).toEqual(pageIndex);
                expect(result.pageCount).toEqual(10);

                expect(result.data.length).toBe(10);
                expect(result.data[0]).toBe(50);
                expect(result.data[1]).toBe(51);
                expect(result.data[2]).toBe(52);
                expect(result.data[3]).toBe(53);
                expect(result.data[4]).toBe(54);
                expect(result.data[5]).toBe(55);
                expect(result.data[6]).toBe(56);
                expect(result.data[7]).toBe(57);
                expect(result.data[8]).toBe(58);
                expect(result.data[9]).toBe(59);

                expect(result.window.length).toEqual(7);

                expect(result.window[0].index).toEqual(0);
                expect(result.window[0].display).toEqual(1);

                expect(result.window[1].index).toEqual(null);
                expect(result.window[1].display).toEqual('...');

                expect(result.window[2].index).toEqual(4);
                expect(result.window[2].display).toEqual(5);

                expect(result.window[3].index).toEqual(5);
                expect(result.window[3].display).toEqual(6);

                expect(result.window[4].index).toEqual(6);
                expect(result.window[4].display).toEqual(7);

                expect(result.window[5].index).toEqual(null);
                expect(result.window[5].display).toEqual('...');

                expect(result.window[6].index).toEqual(9);
                expect(result.window[6].display).toEqual(10);
            });

            it('last page contains less records than the page size (right case)', () => {
                const pageSize = 10;
                const pageIndex = 8;

                const data = [];
                for (let i = 0; i < 100; i++) {
                    data.push(i);
                }

                const result = sut.paginate(data, pageIndex, pageSize);

                expect(result.rowMin).toEqual(81);
                expect(result.rowMax).toEqual(90);

                expect(result.pageSize).toEqual(pageSize);
                expect(result.pageIndex).toEqual(pageIndex);
                expect(result.pageCount).toEqual(10);

                expect(result.data.length).toBe(10);
                expect(result.data[0]).toBe(80);
                expect(result.data[1]).toBe(81);
                expect(result.data[2]).toBe(82);
                expect(result.data[3]).toBe(83);
                expect(result.data[4]).toBe(84);
                expect(result.data[5]).toBe(85);
                expect(result.data[6]).toBe(86);
                expect(result.data[7]).toBe(87);
                expect(result.data[8]).toBe(88);
                expect(result.data[9]).toBe(89);

                expect(result.window.length).toEqual(6);

                expect(result.window[0].index).toEqual(0);
                expect(result.window[0].display).toEqual(1);

                expect(result.window[1].index).toEqual(null);
                expect(result.window[1].display).toEqual('...');
                expect(result.window[2].index).toEqual(6);
                expect(result.window[2].display).toEqual(7);
                expect(result.window[3].index).toEqual(7);
                expect(result.window[3].display).toEqual(8);
                expect(result.window[4].index).toEqual(8);
                expect(result.window[4].display).toEqual(9);
                expect(result.window[5].index).toEqual(9);
                expect(result.window[5].display).toEqual(10);
            });

            it('should check if there is only one page', () => {
                const pageSize = 10;
                const pageIndex = 0;
                const data = [{}];

                const result = sut.paginate(data, pageIndex, pageSize, 1, 0, 0);

                expect(result.window.length).toEqual(1);
            });

            it('last page contains less records than the page size (left case)', () => {
                const pageSize = 10;
                const pageIndex = 2;

                const data = [];
                for (let i = 0; i < 100; i++) {
                    data.push(i);
                }

                const result = sut.paginate(data, pageIndex, pageSize);

                expect(result.rowMin).toEqual(21);
                expect(result.rowMax).toEqual(30);

                expect(result.pageSize).toEqual(pageSize);
                expect(result.pageIndex).toEqual(pageIndex);
                expect(result.pageCount).toEqual(10);

                expect(result.data.length).toBe(10);
                expect(result.data[0]).toBe(20);
                expect(result.data[1]).toBe(21);
                expect(result.data[2]).toBe(22);
                expect(result.data[3]).toBe(23);
                expect(result.data[4]).toBe(24);
                expect(result.data[5]).toBe(25);
                expect(result.data[6]).toBe(26);
                expect(result.data[7]).toBe(27);
                expect(result.data[8]).toBe(28);
                expect(result.data[9]).toBe(29);

                expect(result.window.length).toEqual(6);

                expect(result.window[0].index).toEqual(0);
                expect(result.window[0].display).toEqual(1);

                expect(result.window[1].index).toEqual(1);
                expect(result.window[1].display).toEqual(2);

                expect(result.window[2].index).toEqual(2);
                expect(result.window[2].display).toEqual(3);

                expect(result.window[3].index).toEqual(3);
                expect(result.window[3].display).toEqual(4);

                expect(result.window[4].index).toEqual(null);
                expect(result.window[4].display).toEqual('...');

                expect(result.window[5].index).toEqual(9);
                expect(result.window[5].display).toEqual(10);
            });

            it('Should open last page when pageIndex out of range of new pageCount', () => {
                const pageIndex = 2;
                const pageSize = 10;
                const data = [];
                const expectedData = [];
                for (let i = 0; i < 20; i++) {
                    data.push(i);
                }
                for (let i = 10; i < 20; i++) {
                    expectedData.push(i);
                }
                const result = sut.paginate(data, pageIndex, pageSize);

                expect(result.pageCount).toBe(2);
                expect(result.pageIndex).toBe(1);
                expect(result.data).toEqual(expectedData);
            });
        });
    });
});
