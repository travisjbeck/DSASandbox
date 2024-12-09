export type User = {
  uid: string,
  organizationId: string,
  email: string,
  reportsLeft: number,
  displayName: string,
  photoUrl: string,
  photoData?: string,
  preferences: {
    notifyOnCompletion: boolean,
  }
}