<template>
  <div :class="{ collapsed }" class="exam">
    <div v-if="collapsed" @click="collapsed = false">
      <h3>{{ title }}</h3>
      <span class="label label-success pull-right">{{ label }}</span>
    </div>
    <div v-else>
      <div class="header">
        <h3 class="pull-left">{{ title }}</h3>
        <div class="actions">
          <span
            @click="$emit('delete')"
            class="btn btn-sm btn-link pull-right">
            Delete
          </span>
          <span
            @click="collapsed = true"
            class="btn btn-sm btn-link pull-right">
            Collapse
          </span>
        </div>
      </div>
      <div v-if="!groups.length" class="well">
        Click the button below to Create first question group.
      </div>
      <assessment-group
        v-for="(group, index) in groups"
        :key="group._cid"
        @saveElement="$emit('saveElement', $event)"
        @updateElement="$emit('updateElement', $event)"
        @reorderElement="$emit('reorderElement', $event)"
        @deleteElement="$emit('deleteElement', $event)"
        @update="$emit('updateSubcontainer', $event)"
        @delete="$emit('deleteSubcontainer', group, 'group')"
        :group="group"
        :tes="tes"
        :objectives="examObjectives"
        :position="index" />
      <v-btn
        @click.stop="createGroup"
        :disabled="!container.id"
        color="primary"
        outline
        class="my-5">
        <v-icon class="pr-2">mdi-file-tree</v-icon>
        Add Question Group
      </v-btn>
    </div>
  </div>
</template>

<script>
import AssessmentGroup from '@/edit/AssessmentGroup';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getDescendants as getDeepChildren } from 'utils/activity';
import numberToLetter from 'utils/numberToLetter';
import pluralize from 'pluralize';

export default {
  name: 'exam',
  props: {
    container: { type: Object, required: true },
    position: { type: Number, required: true },
    activities: { type: Object, required: true },
    tes: { type: Object, required: true },
    config: { type: Object, default: () => ({}) }
  },
  data() {
    return { collapsed: this.container.id };
  },
  computed: {
    groups() {
      return filter(this.activities, { parentId: this.container.id });
    },
    title() {
      return `Exam ${numberToLetter(this.position)}`;
    },
    label() {
      const groupTotal = this.groups.length;
      return `${groupTotal} ${pluralize('set', groupTotal)}`;
    },
    examObjectives() {
      const { container, config, activities } = this;
      const activity = find(activities, { id: container.parentId });
      const objectiveTypes = get(config, 'objectives');
      if (!objectiveTypes) return [];
      const children = getDeepChildren(activities, activity);
      return filter(children, it => objectiveTypes.includes(it.type));
    }
  },
  methods: {
    createGroup() {
      this.$emit('addSubcontainer', {
        type: 'ASSESSMENT_GROUP',
        parentId: this.container.id,
        position: this.groups.length + 1
      });
    }
  },
  components: {
    AssessmentGroup
  }
};
</script>

<style lang="scss" scoped>
h3 {
  display: inline-block;
  margin: 0;
  padding: 0;
  color: #505050;
  font-size: 14px;
  text-align: left;
}

.exam {
  margin-bottom: 13px;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);

  > div {
    padding: 15px 25px;
  }

  .header {
    min-height: 50px;
    padding: 5px;
  }
}

.collapsed {
  &:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }
}

.actions {
  > span {
    margin-left: 10px;
  }
}

.label {
  min-width: 40px;
  line-height: 12px;
}
</style>
