# 객체 지향 설계의 5가지 SOLID 원칙:

1. **SRP (단일 책임 원칙: Single Responsibility Principle)**
- 한 클래스는 하나의 책임만 가져야 함
- "책임"의 크기는 상황과 문맥에 따라 다를 수 있음
- 핵심은 변경이 있을 때 파급 효과를 최소화하는 것
- 예: UI 변경, 객체의 생성과 사용을 분리

2. **OCP (개방-폐쇄 원칙: Open/Closed Principle)**
- 소프트웨어는 확장에는 열려있고, 변경에는 닫혀있어야 함
- 다형성을 활용하여 구현
- 문제점:
```java
// 클라이언트가 구현 클래스를 직접 선택하는 경우 
public class MemberService {
    private MemberRepository m = new MemoryMemberRepository(); //기존코드
    private MemberRepository m = new JdbcMemberRepository(); //변경코드
}
```
- 해결책: 객체를 생성하고 연관관계를 맺어주는 별도의 설정자 필요

3. **LSP (리스코프 치환 원칙: Liskov Substitution Principle)**
- 하위 타입은 상위 타입을 대체할 수 있어야 함
- 다형성을 지원하기 위한 원칙
- 인터페이스 규약을 철저히 지켜야 함
- 예: 자동차 인터페이스의 엑셀은 앞으로 가는 기능을 의미하므로, 뒤로 가게 구현하면 LSP 위반

4. **ISP (인터페이스 분리 원칙: Interface Segregation Principle)**
- 범용 인터페이스 하나보다 특정 클라이언트를 위한 여러 개의 인터페이스가 낫다
- 예:
    - 자동차 인터페이스 → 운전 인터페이스, 정비 인터페이스로 분리
    - 사용자 클라이언트 → 운전자 클라이언트, 정비사 클라이언트로 분리
- 장점: 인터페이스가 명확해지고 대체 가능성이 높아짐

5. **DIP (의존관계 역전 원칙: Dependency Inversion Principle)**
- 구체화가 아닌 추상화에 의존해야 함
- 구현 클래스가 아닌 인터페이스에 의존해야 함
- 문제점:
```java
// DIP 위반: 구현 클래스에 직접 의존
MemberRepository m = new MemoryMemberRepository();
```

### 실무 적용 시 고려사항:
1. 인터페이스 도입은 추상화 비용이 발생함
2. 모든 설계에 인터페이스를 도입할 필요는 없음
3. 기능 확장 가능성이 없다면 구체 클래스 직접 사용도 고려
4. 필요할 때 리팩터링으로 인터페이스 도입 가능

### 스프링과의 관계:
- 스프링은 다형성 + OCP, DIP를 지원하기 위해 DI(Dependency Injection)와 DI 컨테이너를 제공
- 이를 통해 클라이언트 코드 변경 없이 기능 확장 가능
- 실제로 자바로 OCP, DIP 원칙을 지키며 개발하다 보면 스프링과 같은 프레임워크의 필요성을 느끼게 됨

이러한 SOLID 원칙들은 좋은 객체 지향 설계를 위한 지침이지만, 실무에서는 상황에 맞게 적절히 적용하는 것이 중요