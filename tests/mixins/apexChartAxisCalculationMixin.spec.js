import {shallowMount} from '@vue/test-utils';
import {apexChartAxisCalculationMixin} from '@/mixins/apexChartAxisCalculationMixin';

describe('apexChartAxisCalculationMixin', () => {
    const TestComponent = {
        mixins: [apexChartAxisCalculationMixin],
        template: '<div></div>',
    };

    function createWrapper() {
        return shallowMount(TestComponent);
    }

    describe('methods', () => {
        it('calculates crude tick interval', () => {
            const wrapper = createWrapper();

            for (const {minimumViewSize, minimumTickInterval, maximumTickQuantity, expected} of [
                {minimumViewSize: 37, minimumTickInterval: 1, maximumTickQuantity: 1, expected: 37},
                {minimumViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 1, expected: 100},
                {minimumViewSize: 100, minimumTickInterval: 150, maximumTickQuantity: 1, expected: 150},
                {minimumViewSize: 1500, minimumTickInterval: 150, maximumTickQuantity: 10, expected: 150},
                {minimumViewSize: 1500, minimumTickInterval: 150, maximumTickQuantity: 9, expected: 300},
                {minimumViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 2, expected: 50},
                {minimumViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 49, expected: 3},
                {minimumViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 50, expected: 2},
                {minimumViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 200, expected: 1},
                {minimumViewSize: 1, minimumTickInterval: 0.1, maximumTickQuantity: 15, expected: 0.1},
                {minimumViewSize: 1, minimumTickInterval: 0.01, maximumTickQuantity: 15, expected: 0.07},
                {minimumViewSize: 0.01, minimumTickInterval: 0.0001, maximumTickQuantity: 4, expected: 0.0025},
            ]) {
                expect(
                    wrapper.vm
                        .calculateAxisCrudeTickInterval(minimumViewSize, minimumTickInterval, maximumTickQuantity),
                ).toBe(expected);
            }
        });

        it('calculates neat tick interval', () => {
            const wrapper = createWrapper();

            for (const {approximateViewSize, minimumTickInterval, maximumTickQuantity, expected} of [
                {approximateViewSize: 0.1, minimumTickInterval: 0.001, maximumTickQuantity: 4, expected: 0.025},
                {approximateViewSize: 0.1, minimumTickInterval: 0.001, maximumTickQuantity: 5, expected: 0.02},
                {approximateViewSize: 0.1, minimumTickInterval: 0.001, maximumTickQuantity: 9, expected: 0.02},
                {approximateViewSize: 0.1, minimumTickInterval: 0.001, maximumTickQuantity: 10, expected: 0.01},
                {approximateViewSize: 0.1, minimumTickInterval: 0.001, maximumTickQuantity: 20, expected: 0.005},
                {approximateViewSize: 37, minimumTickInterval: 1, maximumTickQuantity: 1, expected: 50},
                {approximateViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 1, expected: 100},
                {approximateViewSize: 100, minimumTickInterval: 125, maximumTickQuantity: 1, expected: 250},
                {approximateViewSize: 100, minimumTickInterval: 150, maximumTickQuantity: 1, expected: 1000},
                {approximateViewSize: 1250, minimumTickInterval: 250, maximumTickQuantity: 5, expected: 250},
                {approximateViewSize: 1250, minimumTickInterval: 250, maximumTickQuantity: 4, expected: 500},
                {approximateViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 49, expected: 5},
                {approximateViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 50, expected: 2},
                {approximateViewSize: 100, minimumTickInterval: 1, maximumTickQuantity: 200, expected: 1},
            ]) {
                expect(
                    wrapper.vm
                        .calculateAxisNeatTickInterval(approximateViewSize, minimumTickInterval, maximumTickQuantity),
                ).toBe(expected);
            }
        });

        it('calculates neat or crude tick interval, as specified', () => {
            const wrapper = createWrapper();
            const approximateViewSize = 37;
            const minimumTickInterval = 1;
            const maximumTickQuantity = 1;

            for (const {useNeatTickInterval, expected} of [
                {useNeatTickInterval: true, expected: 50},
                {useNeatTickInterval: false, expected: 37},
            ]) {
                expect(
                    wrapper.vm
                        .calculateAxisTickInterval(
                            approximateViewSize,
                            minimumTickInterval,
                            maximumTickQuantity,
                            useNeatTickInterval,
                        ),
                ).toBe(expected);
            }
        });

        it('calculates axis maximum size', () => {
            const wrapper = createWrapper();

            for (const {axisMinimumValue, dataMaximumValue, tickInterval, expected} of [
                {axisMinimumValue: 0, dataMaximumValue: 100, tickInterval: 10, expected: 100},
                {axisMinimumValue: 0, dataMaximumValue: 100, tickInterval: 11, expected: 110},
                {axisMinimumValue: 0, dataMaximumValue: 100, tickInterval: 20, expected: 100},
                {axisMinimumValue: 7, dataMaximumValue: 103, tickInterval: 20, expected: 100},
                {axisMinimumValue: 7, dataMaximumValue: 103, tickInterval: 1, expected: 96},
                {axisMinimumValue: 6.99, dataMaximumValue: 103, tickInterval: 1, expected: 97},
                {axisMinimumValue: 6.99, dataMaximumValue: 103.5, tickInterval: 1, expected: 97},
                {axisMinimumValue: 6.5, dataMaximumValue: 103.5, tickInterval: 1, expected: 97},
                {axisMinimumValue: 6.494, dataMaximumValue: 103.54, tickInterval: 0.01, expected: 97.05},
            ]) {
                expect(
                    wrapper.vm
                        .calculateAxisMaximumSize(axisMinimumValue, dataMaximumValue, tickInterval),
                ).toBe(expected);
            }
        });

        it('calculates axis view range', () => {
            const wrapper = createWrapper();

            for (const {axisMinimumValue, dataMaximumValue, tickInterval, maximumTickQuantity, expected} of [
                {axisMinimumValue: 5, dataMaximumValue: 105, tickInterval: 10, maximumTickQuantity: 1, expected: 10},
                {axisMinimumValue: 5, dataMaximumValue: 105, tickInterval: 11, maximumTickQuantity: 1, expected: 11},
                {axisMinimumValue: 5, dataMaximumValue: 105, tickInterval: 20, maximumTickQuantity: 4, expected: 80},
                {axisMinimumValue: 5, dataMaximumValue: 105, tickInterval: 20, maximumTickQuantity: 5, expected: 100},
                {axisMinimumValue: 5, dataMaximumValue: 105, tickInterval: 20, maximumTickQuantity: 6, expected: 100},
                {
                    axisMinimumValue: 7.4,
                    dataMaximumValue: 8.1,
                    tickInterval: 0.1,
                    maximumTickQuantity: 9,
                    expected: 0.7,
                },
                {
                    axisMinimumValue: 7.39,
                    dataMaximumValue: 8.1,
                    tickInterval: 0.1,
                    maximumTickQuantity: 9,
                    expected: 0.8,
                },
                {
                    axisMinimumValue: 7.35,
                    dataMaximumValue: 8.14,
                    tickInterval: 0.1,
                    maximumTickQuantity: 9,
                    expected: 0.8,
                },
            ]) {
                expect(
                    wrapper.vm
                        .calculateAxisViewRange(axisMinimumValue, dataMaximumValue, tickInterval, maximumTickQuantity),
                ).toBeCloseTo(expected, 5);
            }
        });

        it('calculates axis view adjustment when zoomed in, with integer values, and using crude tick intervals', () => {
            const wrapper = createWrapper();

            for (const {
                axisMinimumValue,
                dataMaximumValue,
                approximateViewCenter,
                approximateViewSize,
                minimumTickInterval,
                maximumTickQuantity,
                expected
            } of [
                { // places on multiples of tick interval
                    axisMinimumValue: 3,
                    dataMaximumValue: 33,
                    approximateViewCenter: 17,
                    approximateViewSize: 9,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 1,
                    expected: {viewStart: 9, viewEnd: 18, tickInterval: 9, tickQuantity: 1},
                },
                { // places on multiples of tick interval, making view center low if necessary
                    axisMinimumValue: 3,
                    dataMaximumValue: 33,
                    approximateViewCenter: 18,
                    approximateViewSize: 9,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 1,
                    expected: {viewStart: 18, viewEnd: 27, tickInterval: 9, tickQuantity: 1},
                },
                { // places on multiples of tick interval, making view center central if possible
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 4,
                    expected: {viewStart: 9, viewEnd: 45, tickInterval: 9, tickQuantity: 4},
                },
                { // increasing tick quantity, reduces tick interval
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 9, viewEnd: 45, tickInterval: 3, tickQuantity: 12},
                },
                { // increasing tick quantity, adjusts view end if necessary
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 13,
                    expected: {viewStart: 9, viewEnd: 48, tickInterval: 3, tickQuantity: 13},
                },
                { // increasing tick quantity, adjusts view start if necessary
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 14,
                    expected: {viewStart: 6, viewEnd: 48, tickInterval: 3, tickQuantity: 14},
                },
                { // tick interval is a multiple of minimum tick interval
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 2,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 4, viewEnd: 52, tickInterval: 4, tickQuantity: 12},
                },
                { // view cannot move before axis minimum, and end is increased to compensate
                    axisMinimumValue: 6,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 2,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 6, viewEnd: 54, tickInterval: 4, tickQuantity: 12},
                },
            ]) {
                expect(
                    wrapper.vm.calculateAxisViewAdjustment(
                        axisMinimumValue,
                        dataMaximumValue,
                        approximateViewCenter,
                        approximateViewSize,
                        minimumTickInterval,
                        maximumTickQuantity,
                        false,
                    ),
                ).toStrictEqual(expected);
            }
        });

        it('calculates axis view adjustment when zoomed out, with integer values, and using crude tick intervals', () => {
            const wrapper = createWrapper();

            for (const {
                axisMinimumValue,
                dataMaximumValue,
                approximateViewCenter,
                approximateViewSize,
                minimumTickInterval,
                maximumTickQuantity,
                expected
            } of [
                { // view end extends beyond maximum if necessary
                    axisMinimumValue: 6,
                    dataMaximumValue: 51,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 2,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 6, viewEnd: 54, tickInterval: 4, tickQuantity: 12},
                },
                { // tick quantity is reduced to stop exactly at maximum if possible
                    axisMinimumValue: 6,
                    dataMaximumValue: 50,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 2,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 6, viewEnd: 50, tickInterval: 4, tickQuantity: 11},
                },
                { // reduced tick quantity will still extend beyond maximum if necessary
                    axisMinimumValue: 6,
                    dataMaximumValue: 49,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 2,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 6, viewEnd: 50, tickInterval: 4, tickQuantity: 11},
                },
            ]) {
                expect(
                    wrapper.vm.calculateAxisViewAdjustment(
                        axisMinimumValue,
                        dataMaximumValue,
                        approximateViewCenter,
                        approximateViewSize,
                        minimumTickInterval,
                        maximumTickQuantity,
                        false,
                    ),
                ).toStrictEqual(expected);
            }
        });

        it('calculates axis view adjustment with integer values, and using neat tick intervals', () => {
            const wrapper = createWrapper();

            for (const {
                axisMinimumValue,
                dataMaximumValue,
                approximateViewCenter,
                approximateViewSize,
                minimumTickInterval,
                maximumTickQuantity,
                expected
            } of [
                { // view size is increased to higher neat interval
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 4,
                    expected: {viewStart: 10, viewEnd: 50, tickInterval: 10, tickQuantity: 4},
                },
                { // view size is not increased to higher neat interval if not necessary
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 40,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 4,
                    expected: {viewStart: 10, viewEnd: 50, tickInterval: 10, tickQuantity: 4},
                },
                { // view moves to start and not before, and tick intervals remain neat, even if start and end are not neat values
                    axisMinimumValue: 3,
                    dataMaximumValue: 90,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 3, viewEnd: 63, tickInterval: 5, tickQuantity: 12},
                },
                { // view end extends beyond maximum if necessary, whilst adhering to neat interval size
                    axisMinimumValue: 3,
                    dataMaximumValue: 60,
                    approximateViewCenter: 27,
                    approximateViewSize: 36,
                    minimumTickInterval: 1,
                    maximumTickQuantity: 12,
                    expected: {viewStart: 3, viewEnd: 63, tickInterval: 5, tickQuantity: 12},
                },
            ]) {
                expect(
                    wrapper.vm.calculateAxisViewAdjustment(
                        axisMinimumValue,
                        dataMaximumValue,
                        approximateViewCenter,
                        approximateViewSize,
                        minimumTickInterval,
                        maximumTickQuantity,
                        true,
                    ),
                ).toStrictEqual(expected);
            }
        });

        it('calculates axis view adjustment with floating point values', () => {
            const wrapper = createWrapper();

            for (const {
                axisMinimumValue,
                dataMaximumValue,
                approximateViewCenter,
                approximateViewSize,
                minimumTickInterval,
                maximumTickQuantity,
                useNeatTickInterval,
                expected
            } of [
                {
                    axisMinimumValue: 0,
                    dataMaximumValue: 1,
                    approximateViewCenter: 0.5,
                    approximateViewSize: 0.1,
                    minimumTickInterval: 0.01,
                    maximumTickQuantity: 4,
                    useNeatTickInterval: true,
                    expected: {viewStart: 0.4, viewEnd: 0.6, tickInterval: 0.05, tickQuantity: 4},
                },
                {
                    axisMinimumValue: 0,
                    dataMaximumValue: 1,
                    approximateViewCenter: 0.5,
                    approximateViewSize: 0.1,
                    minimumTickInterval: 0.001,
                    maximumTickQuantity: 4,
                    useNeatTickInterval: true,
                    expected: {viewStart: 0.45, viewEnd: 0.55, tickInterval: 0.025, tickQuantity: 4},
                },
                {
                    axisMinimumValue: 0,
                    dataMaximumValue: 1,
                    approximateViewCenter: 0.53,
                    approximateViewSize: 0.12,
                    minimumTickInterval: 0.001,
                    maximumTickQuantity: 7,
                    useNeatTickInterval: false,
                    expected: {viewStart: 0.468, viewEnd: 0.594, tickInterval: 0.018, tickQuantity: 7},
                },
            ]) {
                const result = wrapper.vm.calculateAxisViewAdjustment(
                    axisMinimumValue,
                    dataMaximumValue,
                    approximateViewCenter,
                    approximateViewSize,
                    minimumTickInterval,
                    maximumTickQuantity,
                    useNeatTickInterval,
                );
                expect(result.viewStart).toBeCloseTo(expected.viewStart);
                expect(result.viewEnd).toBeCloseTo(expected.viewEnd);
                expect(result.tickInterval).toBeCloseTo(expected.tickInterval);
                expect(result.tickQuantity).toStrictEqual(expected.tickQuantity);
            }
        });
    });
});
