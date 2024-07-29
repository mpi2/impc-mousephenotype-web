import { renderHook, act } from '@testing-library/react';
import { usePagination } from "@/hooks";

describe("usePagination hook", () => {
  it("works correctly if is provided with original data", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    const updatedItems = Array.from({ length: 60 }, (_, i) => i);
    const { result: hook, rerender} = renderHook((data: Array<number>) => usePagination(data, 10), {
      initialProps: items,
    });
    expect(hook.current.activePage).toBe(0);
    expect(hook.current.totalPages).toBe(10);
    expect(hook.current.paginatedData).toStrictEqual([0,1,2,3,4,5,6,7,8,9]);
    act(() => hook.current.setActivePage(1));
    expect(hook.current.paginatedData).toStrictEqual([10,11,12,13,14,15,16,17,18,19]);
    act(() => hook.current.setPageSize(20));
    act(() => hook.current.setActivePage(0));
    expect(hook.current.totalPages).toBe(5);
    expect(hook.current.paginatedData).toStrictEqual([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
    act(() => hook.current.setActivePage(3));
    rerender(updatedItems);
    expect(hook.current.activePage).toBe(0);
    expect(hook.current.totalPages).toBe(3);
  });
  it("works correctly without providing data", () => {
    const { result: hook, rerender} = renderHook(() => usePagination());
    expect(hook.current.activePage).toBe(0);
    expect(hook.current.pageSize).toBe(10);
    expect(hook.current.paginatedData).toStrictEqual([]);
    act(() => hook.current.setActivePage(1));
    act(() => hook.current.setPageSize(25));
    expect(hook.current.activePage).toBe(1);
    expect(hook.current.pageSize).toBe(25);
  })
});