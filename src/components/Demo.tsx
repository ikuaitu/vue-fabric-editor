import { defineComponent, ref } from 'vue'
import { Alert, Input } from 'view-ui-plus'
import styles from './Demo.module.less'

export default defineComponent({
    setup() {
        const msg = ref('Hello View UI Plus!')
        
        return () => (
            <div class={styles.container}>
                <Alert show-icon>{msg.value}</Alert>
                <Input v-model={msg.value} />
            </div>
        )
    }
})