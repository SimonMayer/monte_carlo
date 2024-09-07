import {shallowMount} from '@vue/test-utils';
import HomePage from '@/components/HomePage.vue';
import router from '@/router';
import store from '@/store';

describe('HomePage.vue', () => {
    let wrapper;
    let originalState;

    beforeEach(() => {
        originalState = JSON.parse(JSON.stringify(store.state));
        wrapper = shallowMount(HomePage, {
            global: {
                plugins: [
                    router,
                    store,
                ],
                stubs: {
                    'router-link': {
                        props: ['to'],
                        template: '<a :href="to"><slot /></a>',
                    },
                },
            },
        });
    });

    afterEach(() => {
        store.replaceState(originalState);
    });

    it('renders the correct welcome message when no ensemble is generated', async () => {
        store.state.ensembleGenerator.generatedTimestamp = null;

        await wrapper.vm.$nextTick();

        expect(wrapper.find('h3').text()).toBe('Welcome!');
        expect(wrapper.text()).toContain('It appears you haven\'t generated an ensemble yet.');
    });

    it('renders the correct message when an ensemble is generated within the last minute', async () => {
        store.state.ensembleGenerator.generatedTimestamp = Date.now();

        await wrapper.vm.$nextTick();

        expect(wrapper.find('h3').text()).toBe('Your ensemble is ready!');
        expect(wrapper.text()).toContain('You have just generated an ensemble');
    });

    it('renders the correct message when an ensemble is generated within the last half hour', async () => {
        store.state.ensembleGenerator.generatedTimestamp = Date.now() - (15 * 60 * 1000);

        await wrapper.vm.$nextTick();

        expect(wrapper.find('h3').text()).toBe('Recently generated ensemble');
        expect(wrapper.text()).toContain('You have a recently generated ensemble');
    });

    it('renders the correct message when the ensemble was generated more than half an hour ago', async () => {
        store.state.ensembleGenerator.generatedTimestamp = Date.now() - (60 * 60 * 1000);

        await wrapper.vm.$nextTick();

        expect(wrapper.find('h3').text()).toBe('Welcome back!');
        expect(wrapper.text()).toContain('an ensemble generated at');
    });

    it('navigates to the simulation inputs page when "Get started" button is clicked', async () => {
        const routerPushSpy = jest.spyOn(wrapper.vm.$router, 'push');
        store.state.ensembleGenerator.generatedTimestamp = null;

        await wrapper.find('button#getStarted').trigger('click');
        expect(routerPushSpy).toHaveBeenCalledWith(wrapper.vm.$router.getRouteById('simulation-inputs'));
    });

    it('clears the ensemble and navigates to the simulation inputs page when "Prepare new ensemble" button is clicked', async () => {
        const routerPushSpy = jest.spyOn(wrapper.vm.$router, 'push');
        wrapper.vm.$store.dispatch = jest.fn();
        store.state.ensembleGenerator.generatedTimestamp = Date.now();

        await wrapper.vm.$nextTick();
        await wrapper.find('button#prepareNewEnsemble').trigger('click');

        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('ensembleGenerator/clearEnsemble');
        expect(routerPushSpy).toHaveBeenCalledWith(wrapper.vm.$router.getRouteById('simulation-inputs'));
    });

    it('renders a list of available charts when an ensemble is generated', async () => {
        store.state.ensembleGenerator.generatedTimestamp = Date.now();

        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('You may view the following charts:');

        const listItems = wrapper.findAll('ul li');
        expect(listItems.length).toBe(1);

        const firstItem = listItems.at(0);
        expect(firstItem.text()).toContain('Forecast burn-up chart');

        const routerLink = firstItem.find('a');
        expect(routerLink.exists()).toBe(true);
        expect(routerLink.attributes('href')).toBe(wrapper.vm.$router.getRouteById('forecast-burn-up'));
    });

    it('displays the correct number of runs and periods when an ensemble is generated', async () => {
        store.state.ensembleGenerator.generatedTimestamp = Date.now();
        store.state.ensembleGenerator.simulationPeriods = 17;
        store.state.ensembleGenerator.simulationProgressionByPeriod = [Array(28).fill(1)];

        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('with 28 runs over 17 periods.');
    });
});
