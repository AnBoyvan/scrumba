'use client';

import { Spinner } from '@/components/common/spinner';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { Sidebar } from '@/components/layout/sidebar';
import { Toolbar } from '@/components/layout/toolbar';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Id } from '@/convex/_generated/dataModel';
import { Profile } from '@/features/members/components/profile';
import { Thread } from '@/features/messages/components/thread';
import { WorkspaceSidebar } from '@/features/workspaces/components/workspace-sidebar';
import { usePanel } from '@/hooks/use-panel';

interface WorkspaceIdLayoutProps {
	children: React.ReactNode;
}

export default function WorkspaceIdLayout({
	children,
}: WorkspaceIdLayoutProps) {
	const { parentMessageId, profileMemberId, onClose } = usePanel();

	const showPanel = !!parentMessageId || !!profileMemberId;

	return (
		<div className="h-full">
			<Toolbar />
			<div className="fleh h-[calc(100vh-40px)] lg:hidden">
				{children}
				<MobileMenu open={showPanel}>
					{parentMessageId ? (
						<Thread
							messageId={parentMessageId as Id<'messages'>}
							onClose={onClose}
						/>
					) : profileMemberId ? (
						<Profile
							memberId={profileMemberId as Id<'members'>}
							onClose={onClose}
						/>
					) : (
						<div className="h-full flex items-center justify-center">
							<Spinner size={5} />
						</div>
					)}
				</MobileMenu>
			</div>
			<div className="hidden lg:flex h-[calc(100vh-40px)]">
				<Sidebar />
				<ResizablePanelGroup
					direction="horizontal"
					autoSaveId="workspace-sidebar"
				>
					<ResizablePanel defaultSize={20} minSize={11} className="bg-sky-700">
						<WorkspaceSidebar />
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel minSize={20} defaultSize={80}>
						{children}
					</ResizablePanel>
					{showPanel && (
						<>
							<ResizableHandle withHandle />
							<ResizablePanel minSize={20} defaultSize={30}>
								{parentMessageId ? (
									<Thread
										messageId={parentMessageId as Id<'messages'>}
										onClose={onClose}
									/>
								) : profileMemberId ? (
									<Profile
										memberId={profileMemberId as Id<'members'>}
										onClose={onClose}
									/>
								) : (
									<div className="h-full flex items-center justify-center">
										<Spinner size={5} />
									</div>
								)}
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
