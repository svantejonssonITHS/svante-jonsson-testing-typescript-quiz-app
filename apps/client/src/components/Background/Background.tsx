// External dependencies
import { Fragment, useEffect, useRef } from 'react';

// Internal dependencies
import RedBlob from '$src/assets/blobs/red.svg';
import OrangeBlob from '$src/assets/blobs/orange.svg';
import YellowBlob from '$src/assets/blobs/yellow.svg';
import GreenBlob from '$src/assets/blobs/green.svg';
import BlueBlob from '$src/assets/blobs/blue.svg';
import PinkBlob from '$src/assets/blobs/pink.svg';
import style from './Background.module.css';

interface BackgroundProps {
	children: JSX.Element;
}

export default function Background({ children }: BackgroundProps): JSX.Element {
	const backgroundRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

	useEffect(() => {
		// Each blob should have thier size and position randomized
		const blobs: NodeListOf<SVGSVGElement> | undefined = backgroundRef.current?.querySelectorAll('svg');

		blobs?.forEach((blob: SVGElement) => {
			const size: number = Math.random() * 100 + 100;
			const positionX: number = Math.random() * 100;
			const positionY: number = Math.random() * 100;

			blob.setAttribute('width', `${size}px`);
			blob.setAttribute('height', `${size}px`);
			blob.style.left = `${positionX}%`;
			blob.style.top = `${positionY}%`;
		});
	}, [backgroundRef]);

	if (!children) throw new Error('Background component requires children');

	return (
		<div
			className={style['background']}
			ref={backgroundRef}
		>
			{[...Array(5)].map((_: unknown, index: number) => (
				<Fragment key={index}>
					<RedBlob />
					<OrangeBlob />
					<PinkBlob />
					<YellowBlob />
					<BlueBlob />
					<GreenBlob />
				</Fragment>
			))}
			<div className={style['content-container']}>{children}</div>
		</div>
	);
}
