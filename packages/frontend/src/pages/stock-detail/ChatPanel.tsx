import { TextArea } from './components';

export const ChatPanel = () => {
  return (
    <article className="flex flex-col gap-5 rounded-md bg-white p-7">
      <h2 className="display-medium20 text-center">채팅</h2>
      <TextArea />
      <hr className="bg-light-gray h-px w-full divide-y border-0"></hr>
      <section className="flex flex-col gap-5">
        {/* ChatMessage 컴포넌트 */}
      </section>
    </article>
  );
};
