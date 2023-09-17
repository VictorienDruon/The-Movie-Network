import { forwardRef, useMemo } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/styles/theme";

interface SheetProps extends Partial<BottomSheet> {
	children: React.ReactNode;
}

export const Sheet = forwardRef<BottomSheet, SheetProps>(
	({ children, ...props }, ref) => {
		const snapPoints = useMemo(() => ["40%", "80%"], []);
		const { colors } = useTheme<Theme>();

		return (
			<BottomSheet
				ref={ref}
				index={-1}
				snapPoints={snapPoints}
				enablePanDownToClose
				backgroundStyle={{ backgroundColor: colors["neutral-3"] }}
				handleIndicatorStyle={{ backgroundColor: colors["neutral-6"] }}
				containerStyle={{ zIndex: 999 }}
				{...props}
			>
				{children}
			</BottomSheet>
		);
	}
);
