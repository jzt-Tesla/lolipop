<template>
  <div class="operate-tree">
    <i-Input v-model="filterText" placeholder="过滤节点" clearable class="filter-input">
      <span slot="prepend">
        <span class="filter-btn">
          <Button size="small" ghost @click="handleRoot">
            <Icon type="md-home"></Icon>
          </Button>
        </span>
        <span v-if="rootAddShow" class="filter-btn">
          <Button v-if="rootAddShow" ghost size="small" @click="rootAdd">
            <Icon type="md-add-circle"></Icon>
          </Button>
        </span>
      </span>
    </i-Input>
    <div :style="{ height: `${this.clientHeight - 240}px`,overflowY: 'auto'}">
      <el-tree
        :data="data"
        ref="operateTree"
        :node-key="value"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false"
        :default-expand-all="defaultExpandAll"
        :accordion="accordion"
        highlight-current
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        :draggable="draggable"
        @node-drop="handleDrop"
        @node-contextmenu="handleContextmenu"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <span v-if="data[icon]" class="span-icon"><Icon :type="data.icon"></Icon></span>
          <!-- 显示label -->
          <span v-if="showLabel">{{ data[label] }}</span>
          <!-- 自定义显示albel -->
          <slot :data="data" :node="node"></slot>
          <!-- 操作按钮 -->
          <span v-if="currData===data[value]">
            <Icon type="md-add-circle" @click.stop="addNode(data,node)" v-if="nodeAdd" size="16" class="operate-btn"></Icon>
            <Icon type="md-create" @click.stop="editNode(data,node)" v-if="nodeEdit" size="16" class="operate-btn"></Icon>
            <Icon type="md-trash" @click.stop="delNode(data,node)" v-if="nodeDel" size="16" class="operate-btn"></Icon>
          </span>
        </span>
        <!--<span >
          <Dropdown transfer trigger="custom" placement="right-start"
                    :visible="currData===data[value]" @on-clickoutside="clickoutside">
            <DropdownMenu slot="list">
              <ul class="ivu-dropdown-menu">
                <li class="ivu-dropdown-item" @click="addNode(data,node)">添加</li>
                <li class="ivu-dropdown-item" v-if="nodeEdit || data[value]!==1" @click="editNode(data,node)">修改</li>
                <li class="ivu-dropdown-item" v-if="nodeEdit || data[value]!==1" @click="delNode(data,node)">删除</li>
               </ul>
            </DropdownMenu>
          </Dropdown>
        </span>-->
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'operate-tree',
    props: {
      // label 是否显示
      showLabel: {
        type: Boolean,
        default: true
      },
      label: {
        type: String,
        default: 'label'
      },
      value: {
        type: String,
        default: 'value'
      },
      icon: {
        type: String,
        default: 'icon'
      },
      // 只展开一个节点
      accordion: {
        type: Boolean,
        default: false
      },
      // 展开所有
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
      // 树数据
      data: {
        type: Array,
        default: []
      },
      expandedKeys: {
        request: false,
        type: Array,
        default: () => {
          return [1]
        }
      },
      // 可拖动节点
      draggable: {
        type: Boolean,
        default: false
      },
      // 根节点显示添加按钮
      rootAddShow: {
        type: Boolean,
        default: false
      },
      // 显示节点添加按钮
      nodeAdd: {
        type: Boolean,
        default: false
      },
      // 显示节点修改按钮
      nodeEdit: {
        type: Boolean,
        default: false
      },
      // 显示节点删除按钮
      nodeDel: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters([
        'clientHeight'
      ])
    },
    data () {
      return {
        // 右击控制弹出
        currData: null,
        // 节点过滤
        filterText: ''
      }
    },
    methods: {
      // 根节点
      rootNode () {
        let data = {}
        data[this.value] = 1
        data[this.label] = '根节点'
        return data
      },
      // 节点过滤
      filterNode (value, data) {
        if (!value) return true
        return data[this.label].indexOf(value) !== -1
      },
      // 树节点点击
      handleNodeClick (data, node, ref) {
        this.currData = null
        /* if (this.currentKey && this.currentKey === data[this.value]) {
           // 取消选中
           this.currentKey = null
           this.$refs.operateTree.setCurrentKey(this.currentKey)
         } else {
           this.currentKey = data[this.value]
         } */
        this.$emit('node-click', data, node, ref)
      },
      // 根节点添加按钮事件
      rootAdd () {
        this.$emit('root-add', this.rootNode())
      },
      // 根节点点击事件
      handleRoot () {
        this.$refs.operateTree.setCurrentKey(null)
        this.$emit('root-load', this.rootNode())
      },
      // 添加节点
      addNode (data, node) {
        this.$emit('node-add', data, node)
      },
      // 编辑节点
      editNode (data, node) {
        this.$emit('node-edit', data, node)
      },
      // 删除节点
      delNode (data, node) {
        this.$emit('node-del', data, node)
      },
      // 鼠标右击
      handleContextmenu (event, data, node) {
        this.currData = data[this.value]
        this.$emit('node-contextmenu', event, data, node)
      },
      // 被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event
      handleDrop (node, innerNode, location, event) {
        this.$emit('node-drop', node, innerNode, location, event)
      },
      // 下拉菜单点击外部
      clickoutside () {
        this.currData = null
      },
      getNode (param) {
        return this.$refs.operateTree.getNode(param)
      }
    },
    mounted () {
      // 保证完全挂载
      this.$nextTick(function () {
      })
    },
    watch: {
      filterText (val) {
        this.$refs['operateTree'].filter(val)
      }
    }
  }
</script>

<style lang="less">
  .operate-tree {

    .filter-input {
      padding-bottom: 5px;
    }

    .filter-btn {
      margin: 0 5px;
    }

    .span-icon {
      padding-right: 4px;
    }

    .operate-btn {
      margin: 0 0 0 3px;
    }

  }


</style>
