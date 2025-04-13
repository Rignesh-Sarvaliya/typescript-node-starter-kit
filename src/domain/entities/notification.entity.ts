export class NotificationEntity {
  constructor(
    public readonly id: number,
    public readonly user_id: number,
    public readonly title: string,
    public readonly message: string,
    public readonly read: boolean,
    public readonly created_at: Date
  ) {}

  isUnread(): boolean {
    return !this.read;
  }
}
