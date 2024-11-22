import { useStore } from 'vuex';
import { computed } from 'vue';
const useUI = () => {

    const store = useStore()

    return {
        sideMenuOpen: computed( {
            get(){
                return store.getters['ui/isSideMenuOpen']
            },
            set(val){
                console.log({val})
                store.commit('ui/toggleSideMenu')          
            }
        }),
        toggleSideMenu(){
            store.commit('ui/toggleSideMenu')
          },

        //Add more methods for the UI state and mutations
        
    }
    //Side menu options
    
}

export default useUI;