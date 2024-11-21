import { useStore } from 'vuex';
import { computed } from 'vue';
const useUI = () => {

    const store = useStore()

    return {
        sideMenuOpen: computed( () => store.getters['ui/isSideMenuOpen']),
        toggleSideMenu(){
            store.commit('ui/toggleSideMenu')
          },
    }
    //Side menu options
    
}

export default useUI;