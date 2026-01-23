"use client"

import { useState } from "react"
import { MessageCircle, Send, Heart, User } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Wish {
  id: string
  author: string
  message: string
  timestamp: string
  likes: number
}

const sampleWishes: Wish[] = [
  {
    id: "1",
    author: "Nguyễn Văn Minh",
    message: "Chúc hai bạn trăm năm hạnh phúc, luôn yêu thương và bên nhau đến đầu bạc răng long! 💕",
    timestamp: "2 phút trước",
    likes: 12,
  },
  {
    id: "2",
    author: "Trần Thu Hương",
    message: "Happy Wedding! Chúc anh chị một cuộc sống hôn nhân viên mãn, tràn đầy niềm vui và tiếng cười. 🎊",
    timestamp: "5 phút trước",
    likes: 8,
  },
  {
    id: "3",
    author: "Lê Hoàng Nam",
    message: "Chúc mừng hai bạn! Thật vui được là một phần trong ngày đặc biệt này. Wish you all the best! ✨",
    timestamp: "10 phút trước",
    likes: 15,
  },
  {
    id: "4",
    author: "Phạm Thị Lan",
    message: "Thật hạnh phúc khi được chứng kiến tình yêu đẹp của hai bạn. Chúc hạnh phúc mãi mãi! 💐",
    timestamp: "15 phút trước",
    likes: 6,
  },
]

export function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>(sampleWishes)
  const [newWish, setNewWish] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [likedWishes, setLikedWishes] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async () => {
    if (!newWish.trim() || !authorName.trim()) return
    
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    const wish: Wish = {
      id: Date.now().toString(),
      author: authorName,
      message: newWish,
      timestamp: "Vừa xong",
      likes: 0,
    }
    
    setWishes((prev) => [wish, ...prev])
    setNewWish("")
    setIsSubmitting(false)
    setShowForm(false)
  }

  const handleLike = (wishId: string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === wishId
          ? { ...w, likes: likedWishes.has(wishId) ? w.likes - 1 : w.likes + 1 }
          : w
      )
    )
    setLikedWishes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(wishId)) {
        newSet.delete(wishId)
      } else {
        newSet.add(wishId)
      }
      return newSet
    })
  }

  return (
    <section className="px-4 py-8 border-t border-border">
      <div className="container mx-auto max-w-2xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ background: "var(--fab-bg)" }}
            >
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Lời chúc
              </h2>
              <p className="text-sm text-muted-foreground">
                {wishes.length} lời chúc
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            className="rounded-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Gửi lời chúc
          </Button>
        </div>

        {/* New Wish Form */}
        {showForm && (
          <div
            className={cn(
              "p-4 rounded-2xl mb-6",
              "border border-border"
            )}
            style={{ background: "var(--wish-card-bg)" }}
          >
            <div className="space-y-3">
              <Input
                placeholder="Tên của bạn"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="h-11 rounded-xl bg-secondary/50 border-0 focus-visible:ring-primary"
              />
              <Textarea
                placeholder="Viết lời chúc của bạn..."
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                className="min-h-[100px] rounded-xl bg-secondary/50 border-0 resize-none focus-visible:ring-primary"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!newWish.trim() || !authorName.trim() || isSubmitting}
                  className="rounded-xl px-6"
                  style={{ background: "var(--fab-bg)" }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Gửi
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Wishes List */}
        <div className="space-y-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className={cn(
                "p-4 rounded-2xl",
                "border border-border",
                "transition-all duration-200 hover:shadow-md"
              )}
              style={{ background: "var(--wish-card-bg)" }}
            >
              {/* Author info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{wish.author}</p>
                  <p className="text-xs text-muted-foreground">{wish.timestamp}</p>
                </div>
              </div>
              
              {/* Message */}
              <p className="text-foreground leading-relaxed mb-3">
                {wish.message}
              </p>
              
              {/* Actions */}
              <button
                onClick={() => handleLike(wish.id)}
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  "px-3 py-1.5 rounded-full",
                  "transition-all duration-200",
                  likedWishes.has(wish.id)
                    ? "bg-red-500/10 text-red-500"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-transform",
                    likedWishes.has(wish.id) && "fill-current scale-110"
                  )}
                />
                <span className="font-medium">{wish.likes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
