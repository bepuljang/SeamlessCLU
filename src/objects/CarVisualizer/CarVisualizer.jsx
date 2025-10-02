import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import GridComponent from "../../components/GridComponent";
import { useTheme } from '../../context/ContextProvider';
import { useCAN } from '../../context/CANProvider';
import { colorScheme } from '../../rules/colorScheme';
import { gx } from '../../rules/gridSizing';
import CarModel from './CarModel';

// 카메라 컨트롤러 컴포넌트
function CameraController({ gearMode, speed, autonomousStatus, aspectRatio }) {
    const { camera, size } = useThree();
    const [currentView, setCurrentView] = useState('default');
    const currentTarget = useRef(new THREE.Vector3(0, -1, 0));

    // 카메라 뷰 프리셋 (모델이 Z축 방향을 향하도록 조정)
    const cameraViews = {
        default: { position: [7, 3, 6], target: [0, 0, 0] },
        driving_ready: { position: [0, 4, -9], target: [0, 0, 0] },
        over_zero: { position: [0, 6, -10], target: [0, 0, 0] },
        top_view: { position: [0, 10, -1], target: [0, 0, 0] }
    };

    // 기어 모드와 속도, 자율주행 상태에 따른 카메라 뷰 변경
    useEffect(() => {
        let targetView = 'default';

        // P 기어일 때는 자율주행 모드에서도 default 뷰
        if (gearMode === 0) {
            targetView = 'default';
        }
        // 자율주행 모드이고 P 기어가 아닐 때는 top_view
        else if (autonomousStatus === 1) {
            targetView = 'top_view';
        }
        // 속도가 0보다 크면 over_zero 뷰로 전환
        else if (speed > 0) {
            targetView = 'over_zero';
        } else {
            // 속도가 0일 때는 기어 모드에 따른 뷰 설정
            // gearMode: 0: P, 1: R, 2: N, 3: D
            switch(gearMode) {
                case 0: // P (Park)
                    targetView = 'default';
                    break;
                case 1: // R (Reverse)
                    targetView = 'driving_ready';
                    break;
                case 2: // N (Neutral)
                    targetView = 'driving_ready';
                    break;
                case 3: // D (Drive)
                    targetView = 'driving_ready';
                    break;
                default:
                    targetView = 'default';
            }
        }

        setCurrentView(targetView);
    }, [gearMode, speed, autonomousStatus]);

    // 카메라 애니메이션 및 FOV 조정
    useFrame((state, delta) => {
        const view = cameraViews[currentView];
        const lerpSpeed = delta * 2; // 전환 속도

        // 카메라 위치 부드럽게 전환
        camera.position.lerp(
            new THREE.Vector3(view.position[0], view.position[1], view.position[2]),
            lerpSpeed
        );

        // 타겟 위치도 부드럽게 전환
        currentTarget.current.lerp(
            new THREE.Vector3(view.target[0], view.target[1], view.target[2]),
            lerpSpeed
        );

        // 카메라가 타겟을 바라보도록 설정
        camera.lookAt(currentTarget.current);

        // 뷰포트 크기에 따른 FOV 동적 조정
        const baseFOV = 35;
        const aspectModifier = Math.min(size.width / size.height, 2);
        const targetFOV = autonomousStatus === 1 ? baseFOV * 1.2 : baseFOV;

        if (camera.fov !== targetFOV) {
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, lerpSpeed);
            camera.updateProjectionMatrix();
        }

        // 카메라 매트릭스 업데이트
        camera.updateMatrixWorld();
    });

    return null;
}

// 움직이는 도로 차선 컴포넌트
function MovingRoadLines({ speed, yOffset = 0 }) {
    // 차선 생성 - 사이드 실선만
    const lines = [];

    // 도로 높이 계산 (기본 높이 -0.98에 오프셋 추가)
    const roadY = -0.4 + yOffset;

    // 좌우 사이드 라인 (고정) - 간격을 절반으로 줄임
    lines.push(
        <group key="side-lines">
            {/* 좌측 긴 실선 */}
            <mesh position={[-1.5, roadY, 0]}>
                <boxGeometry args={[0.1, 0.001, 30]} />
                <meshStandardMaterial
                    color="#FFF"
                    roughness={0}
                    metalness={0}
                    opacity={0.3}
                />
            </mesh>
            {/* 우측 긴 실선 */}
            <mesh position={[1.5, roadY, 0]}>
                <boxGeometry args={[0.1, 0.001, 30]} />
                <meshStandardMaterial
                    color="#FFF"
                    roughness={0}
                    metalness={0}
                    opacity={0.3}
                />
            </mesh>
        </group>
    );

    return <>{lines}</>;
}

// 움직이는 조명 컴포넌트 - 더 강한 조명과 가시적인 효과
function MovingLights({ speed }) {
    const lightGroup1Ref = useRef();
    const lightGroup2Ref = useRef();
    const lightGroup3Ref = useRef();
    const lightPositionOffset = useRef(0);

    useFrame((state, delta) => {
        // 속도에 비례하여 조명 이동 속도 결정
        const moveSpeed = speed > 0 ? (speed / 50) * 10 : 0; // 더 빠른 움직임
        lightPositionOffset.current += delta * moveSpeed;

        // 조명 위치 순환 (더 짧은 사이클로 빠른 움직임 표현)
        const cycleLength = 15;
        if (lightPositionOffset.current > cycleLength) {
            lightPositionOffset.current = 0;
        }

        // 조명 그룹들 움직임 (차량이 Z축 앞으로 가므로 조명은 Z축 뒤로)
        // 모든 조명이 동일하게 움직임 (위상 차이 없음)
        if (lightGroup1Ref.current) {
            lightGroup1Ref.current.position.z = 8 - lightPositionOffset.current;
        }

        if (lightGroup2Ref.current) {
            lightGroup2Ref.current.position.z = 8 - lightPositionOffset.current;
        }

        if (lightGroup3Ref.current) {
            lightGroup3Ref.current.position.z = 8 - lightPositionOffset.current;
        }
    });

    // 조명 강도 설정 (속도에 따라 동적으로 변화)
    const baseIntensity = speed > 0 ? 2 + (speed / 100) : 1.5;
    const spotIntensity = speed > 0 ? 4 + (speed / 50) : 2;

    return (
        <>
            {/* 기본 환경광 - 더 밝게 */}
            <ambientLight intensity={0.5} />

            {/* 조명 그룹 1 - 중앙 */}
            <group ref={lightGroup1Ref} position={[0, 0, 0]}>
                <spotLight
                    position={[0, 6, 0]}
                    angle={0.6}
                    penumbra={0.5}
                    intensity={spotIntensity}
                    color="#ffcc00"
                    castShadow
                    target-position={[0, 0, 0]}
                />
            </group>

            {/* 조명 그룹 2 - 좌측 */}
            <group ref={lightGroup2Ref} position={[0, 0, 0]}>
                <spotLight
                    position={[-4, 6, 0]}
                    angle={0.6}
                    penumbra={0.5}
                    intensity={spotIntensity * 0.9}
                    color="#ffcc00"
                    castShadow
                    target-position={[0, 0, 0]}
                />
            </group>

            {/* 조명 그룹 3 - 우측 */}
            <group ref={lightGroup3Ref} position={[0, 0, 0]}>
                <spotLight
                    position={[4, 6, 0]}
                    angle={0.6}
                    penumbra={0.5}
                    intensity={spotIntensity * 0.9}
                    color="#ffcc00"
                    castShadow
                    target-position={[0, 0, 0]}
                />
            </group>

            {/* 정적 조명들 - 기본 조명 제공 (노란색 톤) */}
            <pointLight
                position={[-8, 8, -8]}
                intensity={0.8}
                color="#ffcc00"
            />

        </>
    );
}

const CarVisualizer = ({ w = 32, h = 10, aW = 8, aH = 8, }) => {
    const [modelCenter, setModelCenter] = useState(new THREE.Vector3(0, 0, 0));
    const [modelSize, setModelSize] = useState(new THREE.Vector3(1, 1, 1));

    // 전체 씬 높이 조정 변수 (이 값을 변경하면 모델과 도로가 함께 이동)
    const sceneYOffset = 0.5; // 위로 올릴 높이 (음수면 아래로)

    const [modelPosition, setModelPosition] = useState({ x: 0, y: sceneYOffset, z: 0 });
    const [modelScale, setModelScale] = useState(0.02);  // 모델 스케일
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, z: 0 });
    const [showControls, setShowControls] = useState(false); // 디버그 컨트롤 표시 여부
    const [showTargetHelper, setShowTargetHelper] = useState(true); // 타겟 헬퍼 표시 여부
    const { theme } = useTheme();
    const { canSignals } = useCAN(); // CAN 신호 가져오기

    const handleModelLoaded = (size) => {
        setModelSize(size);
    };

    // 자율주행 모드 체크
    const isAutonomous = canSignals.autonomousStatus === 1;

    // 스케일 계산 (자율주행 모드에서 1/2로 축소)
    const scale = isAutonomous ? 0.6 : 1;

    // Canvas를 메모이제이션하여 불필요한 리렌더링 방지
    const canvasContent = useMemo(() => (
        <Canvas
            camera={{ position: [5, 2, 5], fov: 35 }}
            style={{ width: '100%', height: '100%', touchAction: 'none' }}
            shadows
            dpr={[1, 2]}
            frameloop="always"
            onCreated={({ gl }) => {
                gl.domElement.style.touchAction = 'none';
                gl.domElement.style.userSelect = 'none';
            }}
        >
            <Suspense fallback={null}>
                {/* 속도에 따라 움직이는 조명 */}
                <MovingLights speed={canSignals.speedValue} />

                {/* 속도에 따라 움직이는 도로 차선 */}
                <MovingRoadLines speed={canSignals.speedValue} yOffset={sceneYOffset} />

                {/* 환경 조명 */}
                <Environment preset="studio" intensity={0.6} />

                {/* CAN 신호 기반 카메라 컨트롤러 */}
                <CameraController
                    gearMode={canSignals.gearMode}
                    speed={canSignals.speedValue}
                    autonomousStatus={canSignals.autonomousStatus}
                />

                {/* 모델 */}
                <CarModel
                    color={colorScheme[theme].carColor}
                    onLoaded={handleModelLoaded}
                    position={[modelPosition.x, modelPosition.y, modelPosition.z]}
                    scale={modelScale}
                    speed={canSignals.speedValue}
                    gearMode={canSignals.gearMode}
                />

                

            </Suspense>
        </Canvas>
    ), [canSignals.speedValue, canSignals.gearMode, canSignals.autonomousStatus, theme, sceneYOffset]);

    return (
        <GridComponent
            w={isAutonomous && aW ? aW : w}
            h={isAutonomous && aH ? aH : h}
            xAlign="center"
            yAlign="center"
            style={{
                overflow: 'hidden',
                pointerEvents: 'none',
                touchAction: 'none',
                userSelect: 'none'
            }}
            y={1}
            aX={-12}
        >
            <div
                className="threed-container"
                style={{
                    width: '1920px',  // 고정 크기
                    height: '720px',  // 고정 크기
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.5s linear',
                    borderRadius: '8px',
                    pointerEvents: 'none',  // 모든 포인터 이벤트 차단
                    touchAction: 'none',     // 터치 이벤트 차단
                    userSelect: 'none'       // 텍스트 선택 차단
                }}
                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
            >
                {canvasContent}
            </div>
        </GridComponent>
    )
}

export default CarVisualizer;