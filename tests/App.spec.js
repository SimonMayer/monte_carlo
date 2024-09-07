import {shallowMount} from '@vue/test-utils';
import App from '@/App.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import router from '@/router';

describe('App.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(App, {
            global: {
                plugins: [router],
                stubs: {
                    'router-link': {
                        props: ['to'],
                        template: '<a :href="to"><slot /></a>',
                    },
                    'router-view': {
                        template: '<div id="theStubbedRouterView"></div>',
                    },
                },
            },
        });
    });

    it('renders the LoadingIndicator component', () => {
        const loadingIndicator = wrapper.findComponent(LoadingIndicator);
        expect(loadingIndicator.exists()).toBe(true);
    });

    it('renders the header with the correct home link', () => {
        const headerLink = wrapper.find('a');
        expect(headerLink.exists()).toBe(true);
        expect(headerLink.attributes('href')).toBe(wrapper.vm.$router.getRouteById('home'));
        expect(headerLink.find('.header').exists()).toBe(true);
    });

    it('renders the correct header text', () => {
        const h1 = wrapper.find('h1');
        const h2 = wrapper.find('h2');
        expect(h1.text()).toBe('Monte Carlo');
        expect(h2.text()).toBe('forecast tool');
    });

    it('renders router-view for content', () => {
        const routerView = wrapper.find('#theStubbedRouterView');
        expect(routerView.exists()).toBe(true);
    });
});
