"use client";

import { Avatar, toast } from "@heroui/react";
import { CameraIcon, EditIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AVATAR_ALLOWED_TYPES, AVATAR_MAX_SIZE } from "@/lib/config";
import { browserServices } from "@/lib/services/browser";

type AvatarInputProps = {
  defaultValue?: string;
  onUpload?: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
};

/**
 * ファイル選択時に即座に Supabase Storage へアップロードし、
 * 取得した公開 URL を onUpload コールバックで親に通知するコンポーネント。
 *
 * アップロードはフォーム送信前に完了するが、設計上問題ない。
 * アバターのファイルパスは `{uid}/avatar` 固定で upsert するため、
 * 保存せずにページを離脱しても孤立ファイルは最大 1 ファイル/ユーザーに留まり、
 * 次回アップロード時に自動的に上書きされる。
 */
export function AvatarInput({
  defaultValue,
  onUpload,
  onUploadingChange,
}: AvatarInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const displayUrl = previewUrl ?? defaultValue;
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!previewUrl) return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !AVATAR_ALLOWED_TYPES.includes(
        file.type as (typeof AVATAR_ALLOWED_TYPES)[number],
      )
    ) {
      toast.danger("jpg、png、webp形式の画像を選択してください");
      e.currentTarget.value = "";
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      toast.danger("画像のサイズは2MB以内にしてください");
      e.currentTarget.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const { uploadAvatar } = browserServices();
      const avatarUrl = await uploadAvatar(file);
      onUpload?.(avatarUrl);
    } catch {
      toast.danger("画像のアップロードに失敗しました");
      setPreviewUrl(undefined);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        aria-label="プロフィール画像を変更"
        className="relative"
      >
        <Avatar className="size-20">
          {displayUrl ? (
            <Avatar.Image src={displayUrl} alt="プロフィール画像" />
          ) : (
            <Avatar.Fallback>
              <CameraIcon className="size-6" />
            </Avatar.Fallback>
          )}
        </Avatar>
        {displayUrl && (
          <div className="absolute right-0 bottom-0 rounded-full bg-default p-1">
            <EditIcon className="size-4" />
          </div>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={AVATAR_ALLOWED_TYPES.join(",")}
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}
