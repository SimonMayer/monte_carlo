import {shallowMount} from '@vue/test-utils';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import store from '@/store';

describe('LoadingIndicator.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(LoadingIndicator, {
            global: {
                plugins: [store],
            },
        });
    });

    it('renders the loading spinner and overlay when isLoading is true', async () => {
        store.state.loading.loadingFlags = {anyKey: true};
        await wrapper.vm.$nextTick();

        const spinner = wrapper.find('img.spinner');
        const overlay = wrapper.find('.loading-overlay');

        expect(spinner.exists()).toBe(true);
        expect(spinner.isVisible()).toBe(true);
        expect(overlay.exists()).toBe(true);
        expect(overlay.isVisible()).toBe(true);
    });

    it('does not render the loading spinner or overlay when isLoading is false', async () => {
        store.state.loading.loadingFlags = {};
        await wrapper.vm.$nextTick();

        const spinner = wrapper.find('img.spinner');
        const overlay = wrapper.find('.loading-overlay');

        expect(spinner.exists()).toBe(true);
        expect(spinner.isVisible()).toBe(false);
        expect(overlay.exists()).toBe(true);
        expect(overlay.isVisible()).toBe(false);
    });

    it('renders loading messages when there are messages in loadingMessages', async () => {
        store.state.loading.loadingFlags = {anyKey: true, anyOtherKey: true};
        store.state.loading.loadingMessages = {anyKey: 'Some message…', anyOtherKey: 'More stuff being said'};

        await wrapper.vm.$nextTick();
        const messages = wrapper.findAll('.loading-messages p');
        expect(messages.length).toBe(2);
        expect(messages.at(0).text()).toBe('Some message…');
        expect(messages.at(1).text()).toBe('More stuff being said');
    });

    it('does not render loading messages when loadingMessages is empty', async () => {
        store.state.loading.loadingFlags = {anyKey: true};
        store.state.loading.loadingMessages = {};

        await wrapper.vm.$nextTick();
        expect(wrapper.find('.loading-messages').exists()).toBe(false);
    });
});
