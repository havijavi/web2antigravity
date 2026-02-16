
export interface PlatformHandler {
    name: string;
    publishContent(content: any): Promise<{ success: boolean; postId?: string; url?: string; error?: string }>;
    postComment(postId: string, comment: string): Promise<{ success: boolean; commentId?: string; error?: string }>;
    likePost(postId: string): Promise<{ success: boolean; error?: string }>;
    getAnalytics(postId: string): Promise<any>;
}
