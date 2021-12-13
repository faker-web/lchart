import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Bar } from '../components/bar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Bar',
  component: Bar,
  parameters: {
    docs: {
      description: {
        component: 'A Component for bar',
      },
    },
  },
} as ComponentMeta<typeof Bar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Bar> = (args) => <Bar {...args} />;

export const BaseBar = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BaseBar.args = {
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
      `x轴的坐标是: ${e.offsetX},
      y轴的坐标是: ${e.offsetY},
      当前选中的数据组是第${idx.groupIdx}组，第${idx.itemIdx}个
      `
    )
  }
};

export const MultipleBar = Template.bind({});
MultipleBar.args = {
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
      `x轴的坐标是: ${e.offsetX},
      y轴的坐标是: ${e.offsetY},
      当前选中的数据组是第${idx.groupIdx}组，第${idx.itemIdx}个
      `
    )
  }
};
