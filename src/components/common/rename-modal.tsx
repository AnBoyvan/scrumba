import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface RenameModalProps {
	children?: React.ReactNode;
	open: boolean;
	setOpen: (value: boolean) => void;
	trigger?: string;
	title: string;
	name?: string;
	placeholder?: string;
	canEdit?: boolean;
	value: string;
	setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	disabled?: boolean;
}

export const RenameModal = ({
	open,
	setOpen,
	trigger,
	title,
	name,
	placeholder,
	canEdit,
	value,
	setValue,
	onSubmit,
	disabled,
	children,
}: RenameModalProps) => {
	const t = useTranslations();
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger disabled={!canEdit} asChild>
				{children ? (
					children
				) : (
					<div className="px-5 py-4 bg-card rounded-lg border cursor-pointer hover:bg-accent transition">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-muted-foreground">
								{trigger}
							</p>
							{canEdit && (
								<p className="text-sm text-link font-semibold hover:underline">
									{t('actions.edit')}
								</p>
							)}
						</div>
						<p className="text-start font-semibold">{name}</p>
					</div>
				)}
			</DialogTrigger>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<form onSubmit={onSubmit} className="space-y-4">
					<Input
						value={value}
						disabled={disabled}
						required
						autoFocus
						minLength={3}
						maxLength={80}
						placeholder={placeholder}
						onChange={setValue}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" disabled={disabled}>
								{t('actions.cancel')}
							</Button>
						</DialogClose>
						<Button type="submit" disabled={disabled}>
							{t('actions.save')}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
