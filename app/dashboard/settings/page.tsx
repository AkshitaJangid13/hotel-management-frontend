import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function SettingsPage() {
    const session = await auth()

    if (!session) {
        redirect('/auth/signin')
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold">Settings</h1>
            <p className="mt-2 text-muted-foreground">Manage your account and preferences</p>

            <div className="mt-8 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your account details and role</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Name</label>
                            <p className="text-sm">{session.user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <p className="text-sm">{session.user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Role</label>
                            <div className="mt-1">
                                <Badge variant="secondary">{session.user.role}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Access Level</CardTitle>
                        <CardDescription>Your permissions and access scope</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {session.user.companyId && (
                            <p className="text-sm">
                                <span className="font-medium">Company:</span> Access granted
                            </p>
                        )}
                        {session.user.brandId && (
                            <p className="text-sm">
                                <span className="font-medium">Brand:</span> Access granted
                            </p>
                        )}
                        {session.user.branchId && (
                            <p className="text-sm">
                                <span className="font-medium">Branch:</span> Access granted
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>About this application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm">Hotel Management System v1.0</p>
                        <p className="text-sm text-muted-foreground">
                            Built with Next.js 15, TypeScript, and Prisma
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}




