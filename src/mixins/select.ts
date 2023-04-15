import { SelectEvent, SelectMode, SelectOneType } from '@/utils/event/types';

interface Data {
  mSelectMode: SelectMode | undefined;
  mSelectOneType: SelectOneType | undefined;
  mSelectId: string;
  mSelectIds: string[];
}

export default {
  inject: ['canvas', 'fabric', 'event'],
  data(): Data {
    return {
      mSelectMode: undefined,
      mSelectOneType: undefined,
      mSelectId: '', // 选择id
      mSelectIds: [], // 选择id
    };
  },
  created() {
    this.event.on(SelectEvent.ONE, (e) => {
      this.mSelectMode = SelectMode.ONE;
      this.mSelectId = e[0].id;
      this.mSelectOneType = e[0].type;
      this.mSelectIds = e.map((item) => item.id);
    });

    this.event.on(SelectEvent.MULTI, (e) => {
      this.mSelectMode = SelectMode.MULTI;
      this.mSelectId = '';
      this.mSelectIds = e.map((item) => item.id);
    });

    this.event.on(SelectEvent.CANCEL, () => {
      this.mSelectId = '';
      this.mSelectIds = [];
      this.mSelectMode = '';
      this.mSelectOneType = '';
    });
  },
  methods: {
    /**
     * @description: 保存data数据
     * @param {Object} data 房间详情数据
     */
    _mixinSelected({ selected }) {
      if (selected.length === 1) {
        const selectItem = selected[0];
        this.mSelectMode = SelectMode.ONE;
        this.mSelectOneType = selectItem.type;
        this.mSelectId = [selectItem.id];
        this.mSelectActive = [selectItem];
      } else if (selected.length > 1) {
        this.mSelectMode = SelectMode.MULTI;
        this.mSelectActive = selected;
        this.mSelectId = selected.map((item) => item.id);
      } else {
        this._mixinCancel();
      }
    },
    /**
     * @description: 保存data数据
     */
    _mixinCancel() {
      this.mSelectMode = '';
      this.mSelectId = [];
      this.mSelectActive = [];
      this.mSelectOneType = '';
    },
    /**
     * @description: 复制到剪切板
     * @param {String} clipboardText 复制内容
     */
    _mixinClipboard(clipboardText) {
      this.$copyText(clipboardText, undefined, (error) => {
        if (error) {
          this.$Message.error('复制失败');
        } else {
          this.$Message.success('复制成功');
        }
      });
    },
  },
};
