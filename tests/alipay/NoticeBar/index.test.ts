import { getInstance, sleep } from 'tests/utils';
import { describe, expect, it, vi } from 'vitest';
import { INoticeBarProps } from '../../../src/NoticeBar/props';
import { SelectorQuery } from '../../selector-query';

const createNoticeBar = (options?: Partial<INoticeBarProps>) => {
  const handleQuery = vi.fn();
  const selector = SelectorQuery.create(handleQuery);

  const my = {
    canIUse() {
      return true;
    },
    createSelectorQuery() {
      return selector;
    },
  };
  const onTransitionEnd = vi.fn();
  const onTap = vi.fn();
  const instance = getInstance(
    'NoticeBar',
    {
      onTransitionEnd,
      onTap,
      handleQuery,
      ...options,
    },
    my
  );
  return {
    instance,
    onTransitionEnd,
    handleQuery,
    onTap,
  };
};

describe('modal onClose', () => {
  it('测试 enableMarquee', async () => {
    const { instance, handleQuery } = createNoticeBar({
      enableMarquee: true,
    });
    handleQuery.mockImplementation((id: string, index: number) => {
      return {
        width: {
          ['.ant-notice-bar-marquee-1']: [200],
          ['.ant-notice-bar-content-1']: [100],
        }[id][index],
      };
    });
    await sleep(30);
    expect(instance.getData()).toEqual({
      'animatedWidth': 0,
      'duration': 2.5,
      'marqueeStyle':
        'transform: translate3d(-100px, 0, 0); transition: 2.5s all linear 0.5s;',
      'overflowWidth': 100,
      'show': true,
      'viewWidth': 100,
    });
    handleQuery.mockImplementation((id: string, index: number) => {
      return {
        width: {
          ['.ant-notice-bar-marquee-1']: [300],
          ['.ant-notice-bar-content-1']: [100],
        }[id][index],
      };
    });
    instance.setProps({
      mode: 'link',
    });
    await sleep(30);
    expect(instance.getData()).toEqual({
      'animatedWidth': 0,
      'duration': 5,
      'marqueeStyle':
        'transform: translate3d(-200px, 0, 0); transition: 5s all linear 0.5s;',
      'overflowWidth': 200,
      'show': true,
      'viewWidth': 100,
    });
  });

  it('测试 loop', async () => {
    const { instance, handleQuery } = createNoticeBar({
      enableMarquee: true,
      loop: true,
    });
    handleQuery.mockImplementation((id: string, index: number) => {
      return {
        width: {
          ['.ant-notice-bar-marquee-1']: [200],
          ['.ant-notice-bar-content-1']: [100],
        }[id][index],
      };
    });
    await sleep(30);
    expect(instance.getData()).toEqual({
      'animatedWidth': 0,
      'duration': 5,
      'marqueeStyle':
        'transform: translate3d(-200px, 0, 0); transition: 5s all linear 0.5s;',
      'overflowWidth': 100,
      'show': true,
      'viewWidth': 100,
    });
    instance.callMethod('onTransitionEnd');
    handleQuery.mockImplementation(async (id: string, index: number) => {
      await sleep(200);
      return {
        width: {
          ['.ant-notice-bar-marquee-1']: [200],
          ['.ant-notice-bar-content-1']: [100],
        }[id][index],
      };
    });
    await sleep(250);
    expect(instance.getData()).toEqual({
      'animatedWidth': 0,
      'duration': 5,
      'marqueeStyle':
        'transform: translate3d(100px, 0, 0); transition: 0s all linear;',
      'overflowWidth': 100,
      'show': true,
      'viewWidth': 100,
    });
    await sleep(300);
    expect(instance.getData()).toEqual({
      'animatedWidth': 0,
      'duration': 5,
      'marqueeStyle':
        'transform: translate3d(-200px, 0, 0); transition: 5s all linear 0.5s;',
      'overflowWidth': 100,
      'show': true,
      'viewWidth': 100,
    });
  });

  it('测试 overflowWidth < 0', async () => {
    const { instance, handleQuery } = createNoticeBar({
      enableMarquee: true,
    });

    handleQuery.mockImplementation((id: string, index: 0) => {
      return {
        width: {
          ['.ant-notice-bar-marquee-1']: [100],
          ['.ant-notice-bar-content-1']: [200],
        }[id][index],
      };
    });
    await sleep(30);
    expect(instance.getData()).toEqual({
      'animatedWidth': 0,
      'duration': 0,
      'marqueeStyle': '',
      'overflowWidth': 0,
      'show': true,
      'viewWidth': 0,
    });
  });
});

describe('tab', () => {
  it('测试 closeable', async () => {
    const { instance, onTap } = createNoticeBar({
      mode: 'closeable',
    });

    instance.callMethod('onTap');
    await sleep(30);
    expect(instance.getData().show).toEqual(false);
    expect(onTap).toBeCalledTimes(1);
  });

  it('测试 closeable 且 onTap 不是函数', async () => {
    const { instance } = createNoticeBar({
      mode: 'closeable',
      onTap: null,
    });

    instance.callMethod('onTap');
    await sleep(30);
    expect(instance.getData().show).toEqual(true);
  });

  it('测试 link', async () => {
    const { instance, onTap } = createNoticeBar({
      mode: 'link',
    });

    instance.callMethod('onTap');
    await sleep(30);
    expect(instance.getData().show).toEqual(true);
    expect(onTap).toBeCalledTimes(1);
  });
});
