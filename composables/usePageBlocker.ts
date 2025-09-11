import { ref, type Ref } from 'vue'

export type PageBlockerMode = 'loading' | 'offline' | 'offline-queued' | 'update' | 'a2hs' | 'success' | 'error' | 'info'
export interface PageBlockerAction { label: string; onClick: () => void | Promise<void> }
export interface PageBlockerState {
  visible: boolean
  mode: PageBlockerMode
  message?: string
  dismissible?: boolean
  actions?: PageBlockerAction[]
}

let _state: Ref<PageBlockerState> | null = null

export function usePageBlocker() {
  if (!_state) {
    _state = ref<PageBlockerState>({ visible: false, mode: 'info', message: '', dismissible: true, actions: [] })
  }
  function show(opts: Partial<PageBlockerState> & { mode?: PageBlockerMode; message?: string }) {
    _state!.value = {
      visible: true,
      mode: opts.mode ?? 'info',
      message: opts.message ?? '',
      dismissible: opts.dismissible ?? true,
      actions: opts.actions ?? []
    }
  }
  function hide() { _state!.value.visible = false }
  function setActions(actions: PageBlockerAction[]) { _state!.value.actions = actions }
  return { state: _state, show, hide, setActions }
}
