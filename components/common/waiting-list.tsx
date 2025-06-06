'use client'

import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import {useEffect, useState} from "react"
import { ConfirmationModal } from "@/components/common/confirm-modal"

// 대기 목록 항목의 기본 타입 정의
export interface WaitingListItemBase {
  id: number;
  requestDate: string;
  name: string; // 이름 필드 (입금자명 또는 은행명 등)
  type: string; // 타입 필드 (유저/가맹점 또는 은행 종류 등)
  approveType: string;
  approveButtonText: string;

}

// 추가 필드를 위한 제네릭 타입 정의
export type WaitingListItem<T = {}> = WaitingListItemBase & T;

// 컬럼 정의 타입
export interface Column {
  key: string;
  header: string;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
}

// 컴포넌트 Props 타입 정의
interface WaitingListComponentProps<T> {
  title: string;
  subtitle: string;
  subtitleIcon: React.ReactNode;
  items: WaitingListItem<T>[];
  columns: Column[];
  searchPlaceholder?: string;
  onApprove: (id: number, type: string, item: WaitingListItem<T>) => void;
  onReject: (id: number, item: WaitingListItem<T>) => void;
  onSearch?: (searchText: string) => void;
  extraActionButton?: React.ReactNode;
  rejectModalTitle?: string;
  rejectModalTargetType?: string;
  rejectModalActionText?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function WaitingListComponent<T>({
  title,
  subtitle,
  subtitleIcon,
  items,
  columns,
  searchPlaceholder = "검색",
  onApprove,
  onReject,
  onSearch,
  extraActionButton,
  rejectModalTitle = "거절 확인",
  rejectModalTargetType = "요청",
  rejectModalActionText = "거절", currentPage, totalPages, onPageChange,
}: WaitingListComponentProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WaitingListItem<T> | null>(null);


  const handleRejectClick = (item: WaitingListItem<T>) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedItem) {
      onReject(selectedItem.id, selectedItem);
      setModalOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              {subtitleIcon}
              <span className="text-sm font-medium">  {subtitle}: {items?.length ?? 0}개개</span>
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="p-6 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchText}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg w-[300px] focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {extraActionButton && (
              <div className="flex items-center gap-3">
                {extraActionButton}
              </div>
            )}
          </div>
        </div>

        {/* 등록 대기 테이블 */}
        <div className="px-6 pb-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead>
              <tr className="bg-gray-50">
                {columns.map((column) => (
                    <th key={column.key}
                        className={`py-3 px-4 text-left font-bold text-gray-500 text-sm ${column.className || ''}`}>
                      {column.header}
                    </th>
                ))}
                <th className="py-3 px-4 text-middle font-bold text-gray-500 text-sm">관리</th>
              </tr>
              </thead>
              <tbody>
              {(items ?? []).map((item) => (
                  <tr key={item.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors font-medium text-black">
                    {columns.map((column) => (
                        <td key={`${item.id}-${column.key}`} className={`py-4 px-4 ${column.className || ''}`}>
                          {column.render
                              ? column.render(item[column.key as keyof typeof item], item)
                              : (item[column.key as keyof typeof item] as React.ReactNode)}
                        </td>
                    ))}
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleRejectClick(item)}
                            className="px-3 py-1.5 rounded-md text-sm font-medium border border-pink-500 text-pink-500 hover:bg-pink-50 transition-all flex items-center gap-1.5"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                          </svg>
                          거절하기
                        </button>
                        <button
                            onClick={() => onApprove(item.id, item.approveType, item)}
                            className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-400 text-gray-600 hover:bg-gray-50 hover:border-gray-500 transition-all flex items-center gap-1.5"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                          </svg>
                          {item.approveButtonText}
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
              <div className="flex flex-col items-center mt-6 gap-4">
                <nav className="flex items-center justify-center gap-1">
                  <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                      <button
                          key={i}
                          onClick={() => onPageChange(i)}
                          className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors font-medium
            ${i === currentPage ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                      >
                        {i + 1}
                      </button>
                  ))}

                  <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className="w-9 h-9 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
          )}
        </div>
      </div>

      {/* 확인 모달 */}
      <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmReject}
          title={rejectModalTitle}
          targetName={`${selectedItem?.name || ""} (${selectedItem?.type || ""})`}
          targetType={rejectModalTargetType}
          actionText={rejectModalActionText}
      />
    </div>
  )
}