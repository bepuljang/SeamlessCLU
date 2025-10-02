import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function CarModel({ color = '#1e40af', onLoaded, position = [0, 0, 0], scale = 0.01, speed = 0, gearMode = 0 }) {
    const mtl = useLoader(MTLLoader, '/src/assets/obj/2025_Genesis_GV60_reduced.mtl');
    const obj = useLoader(OBJLoader, '/src/assets/obj/2025_Genesis_GV60_reduced.obj', (loader) => {
        mtl.preload();
        loader.setMaterials(mtl);
    });

    const { camera } = useThree();
    const wheels = useRef([]);  // 바퀴 메쉬들을 저장
    const headlights = useRef([]);  // 헤드라이트 재질들을 저장
    const taillights = useRef([]);  // 테일라이트 재질들을 저장
    const reverseLights = useRef([]);  // 후진등 재질들을 저장
    const wheelRotation = useRef(0);  // 바퀴 회전 각도 누적
    const modelGroup = useRef();  // 모델 그룹 참조

    // 재질별로 다르게 처리 및 중심점 계산
    useEffect(() => {
        // 모델의 바운딩 박스 계산
        const box = new THREE.Box3();
        const visibleMeshes = [];

        // 초기화
        wheels.current = [];
        headlights.current = [];
        taillights.current = [];
        reverseLights.current = [];

        obj.traverse((child) => {
            if (child.isMesh) {
                visibleMeshes.push(child);

                // 바퀴 메쉬 수집 (rim_fl, tire_fl 등의 패턴)
                const name = child.name?.toLowerCase() || '';
                if ((name.includes('tire') || name.includes('rim')) &&
                    (name.includes('fl') || name.includes('fr') || name.includes('rl') || name.includes('rr'))) {
                    wheels.current.push(child);
                }

                // 재질이 있는 경우에만 처리
                if (child.material) {
                    // 배열인 경우와 단일 재질인 경우를 모두 처리
                    const materials = Array.isArray(child.material) ? child.material : [child.material];

                    materials.forEach((mat, index) => {
                        const materialName = mat.name?.toLowerCase() || '';
                        const objectName = child.name?.toLowerCase() || '';

                        // 재질 이름이 비어있으면 오브젝트 이름을 사용
                        const effectiveName = materialName || objectName;

                        let newMaterial;

                        // Glass 재질 처리 (투명도 추가)
                        if (effectiveName.includes('window') || effectiveName.includes('glass') ) {
                            newMaterial = new THREE.MeshPhysicalMaterial({
                                color: materialName.includes('red') ? '#ff0000' : '#666666',
                                metalness: 0,
                                roughness: 0,
                                transmission: materialName.includes('red') ? 0.5 : 0.9,
                                thickness: 0.3,
                                opacity: 1,
                                transparent: true,
                                envMapIntensity: 0.3,
                                clearcoat: 0.3,
                                clearcoatRoughness: 0.1,
                                ior: 1.45,
                                reflectivity: 0.1,
                                side: THREE.FrontSide,
                                depthWrite: true
                            });
                        }
                        // Chrome 재질 처리 (메탈릭)
                        else if (effectiveName.includes('chrome')) {
                            newMaterial = new THREE.MeshStandardMaterial({
                                color: '#e5e5e5',
                                metalness: 1,
                                roughness: 0,
                                envMapIntensity: 2
                            });
                        }
                        // Light 재질 처리 (헤드라이트 등)
                        else if (effectiveName.includes('light')) {
                            if (effectiveName.includes('red') || effectiveName.includes('tail')) {
                                // 테일라이트 (빨간색)
                                newMaterial = new THREE.MeshStandardMaterial({
                                    color: '#FF0000',
                                    emissive: '#FF0000',
                                    emissiveIntensity: 0.2,
                                    metalness: 0.1,
                                    roughness: 0.1
                                });
                                taillights.current.push(newMaterial);
                            } else if (effectiveName.includes('reverse')) {
                                // 후진등 (하얀색)
                                newMaterial = new THREE.MeshStandardMaterial({
                                    color: '#ffffff',
                                    emissive: '#ffffff',
                                    emissiveIntensity: 0,
                                    metalness: 0.1,
                                    roughness: 0.1
                                });
                                reverseLights.current.push(newMaterial);
                            } else {
                                // 헤드라이트 (하얀색/노란색)
                                newMaterial = new THREE.MeshStandardMaterial({
                                    color: '#ffffff',
                                    emissive: '#ffffcc',
                                    emissiveIntensity: 0,
                                    metalness: 0.1,
                                    roughness: 0.1
                                });
                                headlights.current.push(newMaterial);
                            }
                        }
                        // Rim/Wheel 재질 처리 (휠)
                        else if (effectiveName.includes('rim')) {
                            newMaterial = new THREE.MeshStandardMaterial({
                                color: '#c0c0c0',
                                metalness: 0.7,
                                roughness: 0.1,
                                envMapIntensity: 2
                            });
                        }
                        // Tire 재질 처리
                        else if (effectiveName.includes('tire') || effectiveName.includes('tiire')) {
                            newMaterial = new THREE.MeshStandardMaterial({
                                color: '#0a0a0a',
                                metalness: 0,
                                roughness: 0.95
                            });
                        }
                        // Interior 재질 처리 (leather, fabric)
                        else if (effectiveName.includes('leather') || effectiveName.includes('fabric')) {
                            newMaterial = new THREE.MeshStandardMaterial({
                                color: '#3a3a3a',
                                metalness: 0,
                                roughness: 0.8
                            });
                        }
                        // Paint 재질 처리 (차체 색상 - 변경 가능)
                        else if (effectiveName.includes('paint')) {
                            newMaterial = new THREE.MeshPhysicalMaterial({
                                color: color,
                                metalness: 0.4,
                                roughness: 0.2,
                                clearcoat: 1,
                                clearcoatRoughness: 0.03,
                                envMapIntensity: 1
                            });
                        }
                        // Black piano 재질
                        else if (effectiveName.includes('black piano')) {
                            newMaterial = new THREE.MeshPhysicalMaterial({
                                color: '#0a0a0a',
                                metalness: 0.2,
                                roughness: 0.05,
                                clearcoat: 1,
                                clearcoatRoughness: 0,
                                envMapIntensity: 1
                            });
                        }
                        // Disc (브레이크 디스크)
                        else if (effectiveName.includes('disc')) {
                            newMaterial = new THREE.MeshStandardMaterial({
                                color: '#555555',
                                metalness: 0.9,
                                roughness: 0.4
                            });
                        }
                        // MAT, KANT, Shadow Catcher 등 기타 부품
                        else if (effectiveName.includes('mat') || effectiveName.includes('kant') ||
                                 effectiveName.includes('shadow') || effectiveName.includes('qara')) {
                            newMaterial = new THREE.MeshStandardMaterial({
                                color: '#1a1a1a',
                                metalness: 0.1,
                                roughness: 0.7
                            });
                        }
                        // 기타 재질 (기본 처리 - 차체 색상 적용)
                        else {
                            // 기본적으로 차체 색상을 적용하되, 너무 밝은 재질은 제외
                            const useBodyColor = !materialName.includes('silver') &&
                                                 !materialName.includes('gainsboro') &&
                                                 !materialName.includes('default');

                            newMaterial = new THREE.MeshStandardMaterial({
                                color: useBodyColor ? color : '#808080',
                                metalness: 0.9,
                                roughness: 0.7
                            });
                        }

                        // 재질 교체
                        if (Array.isArray(child.material)) {
                            child.material[index] = newMaterial;
                        } else {
                            child.material = newMaterial;
                        }
                    });

                    // 그림자 설정
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }
        });

        // 보이는 메쉬들만으로 바운딩 박스 계산
        if (visibleMeshes.length > 0) {
            visibleMeshes.forEach(mesh => {
                box.expandByObject(mesh);
            });

            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // 중심점 정보 전달
            if (onLoaded) {
                onLoaded(center, size);
            }
        }
    }, [obj, color, onLoaded, scale]);

    // 조명 효과만 적용 (바퀴 회전 제거)
    // 속도와 연동된 재질 변경 제거 - 에러 방지를 위해 주석 처리
    /*
    useFrame((state, delta) => {
        // 바퀴 회전 비활성화 - 추후 구현 예정
    });
    */

    return (
        <group ref={modelGroup} position={position}>
            <primitive
                object={obj}
                scale={scale}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
            />
        </group>
    );
}

export default CarModel;