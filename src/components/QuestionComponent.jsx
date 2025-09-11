import React from 'react';

const QuestionComponent = ({ question, questionIndex, selectedAnswers, onAnswerClick, quizComplete, showValidation }) => {
    const getBlockColor = (blockIndex, option) => {
        const answerKey = `${questionIndex}-${blockIndex}`;
        const isSelected = selectedAnswers[answerKey] === option;
        if (isSelected) {
            return 'bg-blue-600 border-2 border-blue-400';
        }
        return 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent';
    };

    const isBlockAnswered = (blockIndex) => {
        const answerKey = `${questionIndex}-${blockIndex}`;
        return !!selectedAnswers[answerKey];
    };

    return (
        <div className="mb-6">
            <h3 className="text-xl font-bold text-indigo-400 mb-4">
                Question {questionIndex + 1}: {question.title}
            </h3>
            <p className="text-gray-300 mb-4">{question.description}</p>

            <div className="grid grid-cols-1 gap-4">
                {question.codeBlocks.map((block, blockIndex) => (
                    <div key={blockIndex}>
                        {block.isPuzzle ? (
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {block.options.map((option, optionIndex) => (
                                        <div
                                            key={optionIndex}
                                            className={`
                        p-3 rounded-md cursor-pointer transition-all duration-200
                        ${getBlockColor(blockIndex, option)}
                        ${showValidation && !isBlockAnswered(blockIndex) ? 'ring-2 ring-red-400 ring-opacity-50' : ''}
                      `}
                                            onClick={() => onAnswerClick(questionIndex, blockIndex, option)}
                                        >
                                            <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                                                <code>{option.code}</code>
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-gray-900 rounded-md p-3 shadow-inner">
                                    <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                                        <code>{block.code}</code>
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionComponent;
