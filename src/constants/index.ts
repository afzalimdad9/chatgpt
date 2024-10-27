export const chatIncludeKeys = {
    select: {
        createdAt: true,
        id: true,
        title: true,
        updatedAt: true,
        messages: {
            select: {
                chatId: true,
                content: true,
                id: true, isFailed: true,
                isLoading: true,
                role: true,
                createdAt: true,
                userId: true,
            }
        }
    }
}

export const messageSelectKeys = {
    chatId: true,
    content: true,
    id: true, isFailed: true,
    isLoading: true,
    role: true,
    createdAt: true,
    userId: true,
    chat: chatIncludeKeys
}