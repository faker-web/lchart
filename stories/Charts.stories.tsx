import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Chart } from '../Components';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Chart',
  component: Chart,
  parameters: {
    docs: {
      description: {
        component: 'A Component for line Chart',
      },
    },
  },
} as ComponentMeta<typeof Chart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Chart> = (args) => <Chart {...args} />;

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  type: 'chart',
  padding: 30,
  x: ['2011', '2012', '2013', '2014', '2015'],
  y: [
    {
      labal: '',
      data: [50, 187, 97, 127, 130],
      color: '#2FC25B',
    },
  ],
  onChange: (e, idx) => {
    console.log(
      `x轴的坐标是: ${e.offsetX}, y轴的坐标是: ${e.offsetY}, 当前选中的数据是第${idx}个`
    )
  }
};

export const Multiple = Template.bind({});
Multiple.args = {
  type: 'chart',
  padding: 30,
  x: ['2011', '2012', '2013', '2014', '2015'],
  y: [
    {
      labal: '',
      data: [50, 187, 197, 127, 99],
      color: '#2FC25B',
    },
    {
      labal: '',
      data: [30, 107, 227, 227, 208],
      color: 'red',
    },
  ],
  onChange: (e, idx) => {
    console.log(
      `x轴的坐标是: ${e.offsetX}, y轴的坐标是: ${e.offsetY}, 当前选中的数据是第${idx}个`
    )
  }
};
